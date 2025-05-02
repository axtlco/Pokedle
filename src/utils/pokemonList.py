import requests
from bs4 import BeautifulSoup

url = "https://pokemon.fandom.com/ko/wiki/포켓몬_목록"
res = requests.get(url)
soup = BeautifulSoup(res.text, 'html.parser')

names = []
for td in soup.select('td'):
    text = td.get_text(strip=True)
    if text and len(text) < 10 and not text.isdigit():
        names.append(text)

unique_names = sorted(set(names))

with open("pokemon_korean_names.txt", "w", encoding="utf-8") as f:
    for name in unique_names:
        f.write(name + "\n")
