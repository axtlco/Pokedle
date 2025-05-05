import requests
from bs4 import BeautifulSoup

def get_gen1_pokemon_names():
    url = "https://ko.wikipedia.org/wiki/6세대_포켓몬_목록"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    pokemon_names = []

    # 위키백과에서 class="wikitable" 인 모든 표 중 첫 번째(세대 목록)만 사용
    table = soup.find("table", {"class": "wikitable"})
    rows = table.find_all("tr")[1:]  # 첫 줄은 헤더라 제외

    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            name_korean = cols[1].get_text(strip=True)
            # 괄호 안에 영어가 같이 있는 경우 제거
            name_korean = name_korean.split('(')[0].strip()
            pokemon_names.append(name_korean)

    return pokemon_names

gen1_list = get_gen1_pokemon_names()
print(gen1_list)
print(f"총 {len(gen1_list)}마리 수집됨")
