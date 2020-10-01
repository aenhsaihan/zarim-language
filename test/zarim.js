const Zarim = artifacts.require("./Zarim.sol");

const Language = {
  ENGLISH: 0,
  RUSSIAN: 1,
  JAPANESE: 2,
};

const Gender = {
  FEMALE: 0,
  MALE: 1,
};

const Country = {
  RUSSIA: 0,
  JAPAN: 1,
  USA: 2,
  UK: 3,
};

contract("Zarim", (accounts) => {
  const [englishSpeaker] = accounts;

  it("should register a native English speaker from the United States", async () => {
    const zarimInstance = await Zarim.deployed();

    const age = 18;
    const gender = Gender.MALE;
    const country = Country.USA;
    const language = Language.ENGLISH;

    const receipt = await zarimInstance.registerSpeaker(
      age,
      gender,
      country,
      language,
      {
        from: englishSpeaker,
      }
    );

    const nativeSpeakers = await zarimInstance.nativeSpeakers(language, 0);
    console.log(nativeSpeakers);
  });
});
