import micropip
import asyncio

async def install_library():
    await micropip.install("mahjong")

def omikuji():
    import random
    from js import document
    from mahjong.tile import TilesConverter
    from mahjong.shanten import Shanten
    
    shanten = Shanten()
    
    kinds = [f"{num}{col}" for col in "mpsz" for num in range(1, 10)][:34]
    deck = kinds * 4
    random.shuffle(deck)
    hand = sorted(deck[:14], key=lambda x: x[::-1])
    hand_mpsz = "".join(hand)
    tiles = TilesConverter.one_line_string_to_34_array(hand_mpsz)
    result = shanten.calculate_shanten(tiles)
    
    html = ""

    for i, tile in enumerate(hand):
        col_table = {"m": "man", "p": "pin", "s": "sou", "z": "ji"}
        html += f"<img src='pai-images/{col_table[tile[1]]}{tile[0]}-66-90-l-emb.png'>"
        
    if result == -1:
        result_text = "天和"
    elif result == 0:
        result_text = "聴牌"
    else:
        result_text = f"{result}向聴"
        
    html += f"<br><p style='font-size: 40px; margin: 0;'>{result_text}</p>"
    
    container = document.getElementById("result")
    container.innerHTML = html
    
asyncio.create_task(install_library())