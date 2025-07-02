import os
import re

# 検索対象のフォルダを指定
target_dirs = ['.', 'articles', 'tools', 'problems']
# 出力するJavaScriptファイル名
output_file = 'title-map.js'

# マッピングオブジェクトを初期化
title_map = {}

# 指定されたフォルダ内をスキャン
for directory in target_dirs:
    # フォルダが存在しない場合はスキップ
    if not os.path.exists(directory):
        continue
    
    for filename in os.listdir(directory):
        print(filename)
        if filename.endswith('.html'):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # <title>タグの中身を正規表現で探す
                    match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
                    if match:
                        title = match.group(1).strip()
                        # ファイル名をキー、タイトルを値として辞書に追加
                        title_map[filename] = title
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

# JavaScriptのコードとして出力する文字列を生成
js_code = 'export const pageTitleMap = {\n'
# 見つかったマッピングを追記
if title_map:
    for filename, title in title_map.items():
        # JavaScriptのオブジェクト形式に整形
        js_code += f'    "{filename.replace(".html", "")}": "{title}",\n'
js_code += '};\n'

# ファイルに書き出す
try:
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_code)
    print(f"'{output_file}' has been generated successfully with {len(title_map)} entries.")
except Exception as e:
    print(f"Error writing to {output_file}: {e}")