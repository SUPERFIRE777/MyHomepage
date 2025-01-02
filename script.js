const navHTML = `
<nav>
    <ul>
        <li><a href="index.html">ホーム</a></li>
        <li><a href="introduction.html">自己紹介</a></li>
        <li><a href="works.html">作品</a></li>
        <li><a href="tools.html">ツール</a></li>
        <li><a href="math.html">数学</a></li>
        <li><a href="omikuji.html">おみくじ</a></li>
    </ul>
</nav>
`;

const videoNames = ["足を拝借.mp4"];

function prime_factorize(num) {
    factor = {};
    // 先に2と3で割れるだけ割る
    while(num % 2 == 0){
        factor[2] = (factor[2] || 0) + 1;
        num /= 2;
    }
    while(num % 3 == 0){
        factor[3] = (factor[3] || 0) + 1;
        num /= 3;
    }
    // 5以上の素数は6n+1か6n-1の形で表せる
    divisor = 5;
    while(num > 1){
        if(num % divisor == 0){
            factor[divisor] = (factor[divisor] || 0) + 1;
            num /= divisor;
        }else{
            // 6n-1なら6n+1にするために+2、6n+1なら6n-1にするために+4
            divisor += (divisor % 6 == 1) ? 4 : 2;
        }
        if(divisor * divisor > num) break;
    }
    if(num > 1) factor[num] = (factor[num] || 0) + 1;
    texts = [];
    upper = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    for (const [prime, power] of Object.entries(factor)) {
        text = `${prime}`;
        if(power > 1){
            p = power;
            power_text = "";
            while(p > 0){
                power_text += upper[p % 10];
                p = Math.floor(p / 10);
            }
            power_text = power_text.split("").reverse().join("");
            text += power_text;
        }
        texts.push(text);
    }
    return texts.join("×");
}

function getYYYYMMDD() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function todays_factor(){
    var yyyymmdd = getYYYYMMDD();
    var prime_factor = prime_factorize(parseInt(yyyymmdd));
    if(yyyymmdd == prime_factor){
        return `${yyyymmdd}は素数です！`;
    }else{
        return `${yyyymmdd} = ${prime_factor}`;
    }
}

function prime_factor_display_text(string){
    var int = parseInt(string);
    console.log()
    if (string == ""){
        return `値を入力してください`;
    }
    if (isNaN(int) || int < 2 || int > Number.MAX_SAFE_INTEGER){
        return `対応外の値です`;
    }
    var prime_factor = prime_factorize(int);
    if(int == prime_factor){
        return `${int}は素数です！`;
    }else{
        return `${int} = ${prime_factor}`;
    }
}

function prime_factor_display(time = false){
    const element = document.getElementById('input_number');
    const prime_factor_element = document.getElementById('output_prime_factor');

    const start = Date.now();
    const prime_factor = prime_factor_display_text(element.value);
    const end = Date.now();
    if(time && prime_factor != `値を入力してください` && prime_factor != `対応外の値です`){
        prime_factor_element.innerText = prime_factor + ` (${end - start}ms)`;
    }else{
        prime_factor_element.innerText = prime_factor;
    }
}

function copy_text_by_id(id){
    const message_element = document.getElementById('copy_message');
    if(!navigator.clipboard){
        message_element.innerText = "Copy unavailable";
        return;
    }

    const element = document.getElementById(id);
    navigator.clipboard.writeText(element.innerText).then(function(){
        message_element.innerText = "Copied!";
    }, function(){
        message_element.innerText = "Copy failed";
    });
}

function number_display(big_int){
    var units = ["", "万", "億", "兆", "京", "垓", "𥝱", "穣", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"];
    var text = "";
    if(big_int >= 10n ** 72n){
        return "(" + number_display(big_int / 10n ** 68n) + ")無量大数" + number_display(big_int % 10n ** 68n);
    }
    while(big_int > 0n){
        var n = big_int >= 10000n ? `${big_int % 10000n}`.padStart(4, "0"): big_int;
        text = `${n}${units.shift()}${text}`;
        big_int /= 10000n;
    }
    return text;
}

function ceil_point(){
    const result_element = document.getElementById('output_ceil_point');
    const han = document.getElementById('han').value;
    const fu = document.getElementById('fu').value;
    const multi = document.getElementById('multi').value;
    // BigIntは小数の掛け算ができないので100倍で計算して100で割る
    const multi_100 = BigInt(Math.round(multi * 100));
    const point = BigInt(fu) * (2n ** (BigInt(han) + 2n)) * multi_100 / 100n;
    const ceil = (x) => (x + 99n) / 100n * 100n;
    const child_ron = number_display(ceil(point * 4n));
    const parent_ron = number_display(ceil(point * 6n));
    const child_tsumo = number_display(ceil(point)) + " / " + number_display(ceil(point * 2n));
    const parent_tsumo = number_display(ceil(point * 2n)) + "オール";
    var text = "";
    if(han == "" || fu == "" || multi == ""){
        text = "値を入力してください";
    }else{
        text += "<table>";
        text += "<tr><th></th><th>ロン</th><th>ツモ</th></tr>";
        text += `<tr><td>親</td><td>${parent_ron}</td><td>${parent_tsumo}</td></tr>`;
        text += `<tr><td>子</td><td>${child_ron}</td><td>${child_tsumo}</td></tr>`;
        text += "</table>";
    }
    if (result_element != null){
        result_element.innerHTML = text;
    }
}

async function fetch_images(){
    const suits = ["man", "pin", "sou", "ji"];

    try {
        // 各画像URLを生成し、非同期で読み込む
        for (let suit of suits) {
            for (let j = 1; j <= 9; j++) {
                if (suit === "ji" && j === 7) break;
                const url = `pai-images/${suit}${j}-66-90-l-emb.png`;
                
                // 非同期に画像を読み込み
                await fetch(url);
            }
        }

        console.log("すべての画像がキャッシュされました");
    } catch (error) {
        console.error("画像のキャッシュに失敗しました", error);
    }
}

function zfill(s, n){
    return s.toString().padStart(n, "0")
}

function timeDisplay(second){
    var sec = second % 60;
    var min = Math.floor((second % 3600) / 60);
    var hour = Math.floor((second % 86400) / 3600);
    var day = Math.floor(second / 86400);

    if(second >= 86400){
        return `${day}日${zfill(hour, 2)}時間${zfill(min, 2)}分${zfill(sec, 2)}秒`;
    }
    if(second >= 3600){
        return `${hour}時間${zfill(min, 2)}分${zfill(sec, 2)}秒`;
    }
    if(second >= 60){
        return `${min}分${zfill(sec, 2)}秒`;
    }
    return `${sec}秒`;
}

window.onload = async function() {
    document.getElementById('nav-container').innerHTML = navHTML;

    const h1Element = document.querySelector('h1');
    h1Element.style.backgroundImage = "url('background.jpeg')";
    h1Element.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    h1Element.style.backgroundBlendMode = "lighten";
    h1Element.style.backgroundSize = "cover";
    h1Element.style.backgroundPosition = "center";

    var element = document.getElementById('load');
    
    if(element != null){
        await fetch_images();
    }

    for(let i=0; i<videoNames.length; i++){
        var element = document.getElementById(`video${i}`);
        if(element == null){
            continue;
        }
        element.innerHTML += `
        <video width="640" height="360" controls>
            <source src="${videoNames[i]}" type="video/mp4">
        </video>
        `;
    }

    setInterval(function(){
        var element = document.getElementById('time');
        if(element != null){
            element.innerText = new Date().toLocaleString({"hour12": false});
        }
    }, 0);

    setInterval(function(){
        var element = document.getElementById('countdown');
        if(element != null){
            var now = new Date();
            if(now.getMonth() == 0 && now.getDate() == 1){
                var newYear = new Date(now.getFullYear(), 0, 1);
            }else{
                var newYear = new Date(now.getFullYear() + 1, 0, 1);
            }
            var second = Math.ceil((newYear - now) / 1000);
            if(second > 0){
                element.innerText = timeDisplay(second);
            }else{
                element.innerText = "0秒\nHappy New Year!!";
            }
        }
    }, 0);

    setInterval(function(){
        var element = document.getElementById('factor');
        if(element != null){
            element.innerText = todays_factor();
        }
    }, 0);

};

