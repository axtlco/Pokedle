from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import json

def get_pokemon_names(gen: int) -> list:
    url = f"https://namu.wiki/w/포켓몬스터(포켓몬스터)/목록/{gen}세대"
    print(f"{gen}세대 접속 중: {url}")

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=options)
    driver.get(url)
    time.sleep(2) 

    pokemons = []
    elements = driver.find_elements(By.CSS_SELECTOR, "div.ANzwFr3B > a")

    for el in elements:
        name = el.get_attribute("title")
        if name and name not in pokemons:
            pokemons.append(name.strip())

    driver.quit()
    print(f"{gen}세대: {len(pokemons)}마리 수집됨")
    return pokemons

def main():
    all_generations = {}

    for gen in range(1, 10):
        names = get_pokemon_names(gen)
        all_generations[str(gen)] = names
        time.sleep(1)

    with open("pokemon_by_generation.json", "w", encoding="utf-8") as f:
        json.dump(all_generations, f, ensure_ascii=False, indent=2)

    print("JSON 저장 완료!")

if __name__ == "__main__":
    main()
