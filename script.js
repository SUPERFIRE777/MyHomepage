const navHTML = `
<nav>
    <ul>
        <li><a href="index.html">ホーム</a></li>
        <li><a href="introduction.html">自己紹介</a></li>
        <li><a href="works.html">作品</a></li>
    </ul>
</nav>
`;

const videoNames = ["足を拝借.mp4"];

window.onload = function() {
    document.getElementById('nav-container').innerHTML = navHTML;
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
};
