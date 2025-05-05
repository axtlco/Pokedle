import requests
from bs4 import BeautifulSoup
import json
import time

def get_pokemon_names_from_wiki(gen: int) -> list:
    url = f"https://ko.wikipedia.org/wiki/{gen}세대_포켓몬_목록"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    
    if res.status_code != 200:
        print(f"{gen}세대 페이지 오류: {res.status_code}")
        return []

    soup = BeautifulSoup(res.text, "html.parser")
    pokemon_names = []

    table = soup.find("table", {"class": "wikitable"})
    if not table:
        print(f"{gen}세대에서 테이블을 찾을 수 없음")
        return []

    rows = table.find_all("tr")[1:]

    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            name_korean = cols[1].get_text(strip=True)
            name_korean = name_korean.split('(')[0].strip()
            if name_korean:
                pokemon_names.append(name_korean)

    print(f"{gen}세대: {len(pokemon_names)}마리 수집됨")
    return pokemon_names

def save_as_txt(gen: int, names: list):
    filename = f"gen{gen}_list.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(str(names))
    print(f"저장됨: {filename}")

def main():
    result = {}

    for gen in range(1, 10):
        names = get_pokemon_names_from_wiki(gen)
        result[str(gen)] = names
        save_as_txt(gen, names)
        time.sleep(1)

    with open("pokemon_by_generation.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print("모든 세대 저장 완료 → pokemon_by_generation.json + gen1~9_list.txt")

if __name__ == "__main__":
    main()
