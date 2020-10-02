const Zarim = artifacts.require("./Zarim.sol");

require("chai").use(require("chai-as-promised")).should();

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
  const [englishSpeaker, britishSpeaker, multilingualSpeaker] = accounts;
  let zarimInstance;

  const englishSpeakerProfile = {
    age: 18,
    gender: Gender.MALE,
    country: Country.USA,
    language: [Language.ENGLISH],
    account: englishSpeaker,
  };

  const britishSpeakerProfile = {
    age: 23,
    gender: Gender.FEMALE,
    country: Country.UK,
    language: [Language.ENGLISH],
    account: britishSpeaker,
  };

  const multilingualSpeakerProfile = {
    age: 18,
    gender: Gender.MALE,
    country: Country.JAPAN,
    language: [Language.ENGLISH, Language.RUSSIAN, Language.JAPANESE],
    account: multilingualSpeaker,
  };

  beforeEach(async () => {
    zarimInstance = await Zarim.deployed();
  });

  describe("registration of one native English speaker", async () => {
    it("should not have any native English speakers before registration", async () => {
      let englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.ENGLISH
      );
      englishSpeakersCount.toNumber().should.equal(0);
    });

    it("should register a native English speaker from the United States", async () => {
      const { age, gender, country, language } = englishSpeakerProfile;
      const receipt = await zarimInstance.registerSpeaker(
        age,
        gender,
        country,
        language,
        {
          from: englishSpeaker,
        }
      );

      englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        language
      );

      const registeredSpeakerIndex = englishSpeakersCount - 1;
      const registeredSpeaker = await zarimInstance.nativeSpeakers(
        language,
        registeredSpeakerIndex
      );

      const speakerProfile = await zarimInstance.speakers(registeredSpeaker);
      speakerProfile.id.should.equal(
        englishSpeaker,
        "speaker has not been correctly registered"
      );
      speakerProfile.age
        .toNumber()
        .should.equal(age, "age has not been correctly registered");
      speakerProfile.gender
        .toNumber()
        .should.equal(gender, "gender has not been correctly registered");
    });

    it("should have one native English speakers after registration", async () => {
      let englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.ENGLISH
      );
      englishSpeakersCount.toNumber().should.equal(1);
    });
  });

  describe("registration of second native English speaker", async () => {
    it("should register a native English speaker from the United Kingdom", async () => {
      const { age, gender, country, language } = britishSpeakerProfile;
      const receipt = await zarimInstance.registerSpeaker(
        age,
        gender,
        country,
        language,
        {
          from: britishSpeaker,
        }
      );

      englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        language
      );

      const registeredSpeakerIndex = englishSpeakersCount - 1;
      const registeredSpeaker = await zarimInstance.nativeSpeakers(
        language,
        registeredSpeakerIndex
      );

      const speakerProfile = await zarimInstance.speakers(registeredSpeaker);
      speakerProfile.id.should.equal(
        britishSpeaker,
        "speaker has not been correctly registered"
      );
      speakerProfile.age
        .toNumber()
        .should.equal(age, "age has not been correctly registered");
      speakerProfile.gender
        .toNumber()
        .should.equal(gender, "gender has not been correctly registered");
    });

    it("should have two native English speakers after registration", async () => {
      let englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.ENGLISH
      );
      englishSpeakersCount.toNumber().should.equal(2);
    });
  });

  describe("registration of multilingual native speaker", async () => {
    it("should register a multilingual native speaker from Japan", async () => {
      const { age, gender, country, language } = multilingualSpeakerProfile;

      const receipt = await zarimInstance.registerSpeaker(
        age,
        gender,
        country,
        language,
        {
          from: multilingualSpeaker,
        }
      );
    });

    it("should have three native English speakers after registration", async () => {
      let englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.ENGLISH
      );
      englishSpeakersCount.toNumber().should.equal(3);
    });

    it("should have one native Japanese speaker after registration", async () => {
      let japaneseSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.JAPANESE
      );
      japaneseSpeakersCount.toNumber().should.equal(1);
    });

    it("should have one native Russian speaker after registration", async () => {
      let russianSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.RUSSIAN
      );
      russianSpeakersCount.toNumber().should.equal(1);
    });
  });
});
