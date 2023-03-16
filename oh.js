const fetchData = async (url) => {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  };
  class character {
    constructor(
      name,
      gender,
      height,
      mass,
      hair_color,
      skin_color,
      eye_color,
      movies
    ) {
      this.name = name;
      this.gender = gender;
      this.height = Number(height);
      this.mass = Number(mass);
      this.hairColor = hair_color;
      this.skinColor = skin_color;
      this.eyeColor = eye_color;
      this.movies = movies.length;
      this.pictureUrl = name.replace(/\s/g, "-");
    }
  }
  
  let showInfo = document.querySelector("#showCaracters");
  let characterCards = document.querySelector("#characterCards");
  let extraInfo = document.querySelector("#extraInfo");
  let compareBtn = document.querySelector("#compareBtn");
  
  let alert = document.querySelector("#alert");
  let theCharacters = [];
  
  let showCharacters = () => {
    theCharacters = []; //Tömmer arrayen för varje ny funktion.
    alert.innerHTML = "";
    let character1 = document.querySelector('select[name="characterList1"]')
      .value;
    let character2 = document.querySelector('select[name="characterList2"]')
      .value;
    let text = document.createElement("p");
    if (character1 === character2) {
      text.innerText = "Please choose two different characters";
      alert.append(text);
    } else {
      theCharacters.push(character1, character2);
      allCharacters(theCharacters);
    }
  };
  
  showInfo.addEventListener("click", () => {
    characterCards.innerHTML = "";
    showCharacters();
  });
  
  let getCharacther = async (id) => {
    try {
      characterCards.innerHTML = "Loding....";
      let response = await fetchData(`https://swapi.dev/api/people?search=${id}`);
      return response;
    } catch (err) {
      console.log("error", err);
    }
  };
  
  let allCharacters = async (arr) => {
    try {
      let promises = arr.map((id) => getCharacther(id));
      let results = await Promise.all(promises);
      console.log(results);
      renderCharacters(results);
    } catch (err) {
      console.log("error", err);
    }
  };
  
  let renderCharacters = (characters) => {
    characterCards.innerHTML = "";
    compareBtn.style.display = "none";
  
    let characterArr = [];
    characters.forEach((obj) => {
      obj = obj.results[0]; //Objektet ligger i en array. Men det finns bara en. Därav index 0.
      let newCharacter = new character(
        obj.name,
        obj.gender,
        obj.height,
        obj.mass.replace(",", ""),
        obj.hair_color,
        obj.skin_color,
        obj.eye_color,
        obj.films
      );
      //Pusha in i en array för arr kunna jämföra de två mot varandra. utanför forEachen.
      characterArr.push(newCharacter);
    });
  
    characterArr.forEach((newCharacter) => {
      let div = document.createElement("div");
      let heading = document.createElement("h3");
      heading.innerText = `${newCharacter.name}`;
      div.innerHTML = `<img src="./js/${newCharacter.pictureUrl}.png" alt="Picture of ${newCharacter.name}">`;
      div.append(heading);
  
      characterCards.append(div);
    });
  
    compareBtn.style.display = "block";
  
    compareBtn.addEventListener("click", () => {
      extraInfo.innerText = "";
      let extraInfoDiv = document.createElement("div");
      extraInfoDiv.setAttribute("id", "styling");
      characterArr.forEach((newCharacter) => {
        let moreInfo = document.createElement("div");
        moreInfo.innerHTML = `
            <ul>
                <li>Character: ${newCharacter.name}</li>
                <li>Gender: ${newCharacter.gender}</li>
                <li>Height: ${newCharacter.height} cm</li>
                <li>Body mass: ${newCharacter.mass} kg</li>
                <li>Hair Color: ${newCharacter.hairColor}</li>
                <li>Skin Color: ${newCharacter.skinColor}</li>
                <li>Eye Color: ${newCharacter.eyeColor}</li>
                <li>Number of films: ${newCharacter.movies}</li>
            </ul>
            `;
        extraInfoDiv.appendChild(moreInfo);
      });
      extraInfo.append(extraInfoDiv, compareDiv);
    });
  
    // Create compareDiv and compare elements
    const compareDiv = document.createElement("div");
    compareDiv.setAttribute("id", "compare");
    const compare = document.createElement("ul");
  
    const properties = [
      "gender",
      "height",
      "mass",
      "hairColor",
      "skinColor",
      "eyeColor",
      "movies"
    ];
    for (const property of properties) {
      // Create li element for each property
      const li = document.createElement("li");
      let message;
  
      // Compare the property values of each character
      if (characterArr[0][property] === characterArr[1][property]) {
        message = `${characterArr[0].name} has the same ${property} as ${characterArr[1].name}`;
      } else if (characterArr[0][property] > characterArr[1][property]) {
        message = `${characterArr[0].name} has a higher ${property} than ${characterArr[1].name}`;
      } else {
        message = `${characterArr[1].name} has a higher ${property} than ${characterArr[0].name}`;
      }
  
      
      li.textContent = message;
  
     
      compare.appendChild(li);
    }
  
    
    compareDiv.appendChild(compare);
  };
  