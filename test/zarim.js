const Zarim = artifacts.require("./Zarim.sol");

const { expectRevert, time, BN } = require("@openzeppelin/test-helpers");

require("chai").use(require("chai-as-promised")).should();

const Language = {
  ENGLISH: 0,
  RUSSIAN: 1,
  JAPANESE: 2,
  SPANISH: 3,
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
  const [
    englishSpeaker,
    multilingualSpeaker,
    russianSpeaker,
    unregisteredSpeaker,
    learner,
  ] = accounts;
  let zarimInstance;
  const BigNumber = web3.utils.BN;

  const englishSpeakerProfile = {
    age: 18,
    gender: Gender.MALE,
    country: Country.USA,
    language: [Language.ENGLISH],
    account: englishSpeaker,
  };

  const multilingualSpeakerProfile = {
    age: 18,
    gender: Gender.MALE,
    country: Country.JAPAN,
    language: [Language.ENGLISH, Language.RUSSIAN, Language.JAPANESE],
    account: multilingualSpeaker,
  };

  const russianSpeakerProfile = {
    age: 21,
    gender: Gender.FEMALE,
    country: Country.RUSSIA,
    language: [Language.RUSSIAN],
    account: russianSpeaker,
  };

  before(async () => {
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

    it("should not permit duplicate account", async () => {
      const { age, gender, country, language } = englishSpeakerProfile;

      await expectRevert(
        zarimInstance.registerSpeaker(age, gender, country, language, {
          from: englishSpeaker,
        }),
        "Speaker is already registered"
      );
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

      const isEnglishNative = await zarimInstance.isNative.call(
        multilingualSpeaker,
        Language.ENGLISH
      );

      const isRussianNative = await zarimInstance.isNative.call(
        multilingualSpeaker,
        Language.RUSSIAN
      );

      const isJapaneseNative = await zarimInstance.isNative.call(
        multilingualSpeaker,
        Language.JAPANESE
      );

      const isSpanishNative = await zarimInstance.isNative.call(
        multilingualSpeaker,
        Language.SPANISH
      );

      isEnglishNative.should.be.true;
      isRussianNative.should.be.true;
      isJapaneseNative.should.be.true;
      isSpanishNative.should.be.false;
    });

    it("should have two native English speakers after registration", async () => {
      let englishSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.ENGLISH
      );
      englishSpeakersCount.toNumber().should.equal(2);
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

  describe("registration of native Russian speaker", async () => {
    before(async () => {
      const { age, gender, country, language } = russianSpeakerProfile;

      const receipt = await zarimInstance.registerSpeaker(
        age,
        gender,
        country,
        language,
        {
          from: russianSpeaker,
        }
      );
    });

    it("should have two native Russian speakers after registration", async () => {
      let russianSpeakersCount = await zarimInstance.getSpeakersCount.call(
        Language.RUSSIAN
      );
      russianSpeakersCount.toNumber().should.equal(2);
    });
  });

  describe("make deposit", async () => {
    it("should have an empty balance before deposit", async () => {
      const previousBalance = await zarimInstance.balanceOf.call(
        englishSpeaker
      );
      previousBalance.toNumber().should.equal(0);
    });

    it("should be able to make a deposit", async () => {
      const amount = 100;
      await zarimInstance.deposit({ from: englishSpeaker, value: amount });
      const currentBalance = await zarimInstance.balanceOf.call(englishSpeaker);
      currentBalance.toNumber().should.equal(amount);
    });
  });

  describe("withdraw", async () => {
    it("should transfer balance to withdrawing speaker", async () => {
      const previousBalance = await zarimInstance.balanceOf.call(
        englishSpeaker
      );

      await zarimInstance.withdraw({ from: englishSpeaker });

      const currentBalance = await zarimInstance.balanceOf.call(englishSpeaker);
      currentBalance.toNumber().should.equal(0);
    });
  });

  describe("opening the session", async () => {
    const language = Language.ENGLISH;
    const deposit = 100;
    const price = 1;
    const duration = 100;

    it("prevent session if balance is insufficient", async () => {
      await expectRevert(
        zarimInstance.openSession(language, price, duration, {
          from: learner,
        }),
        "Insufficient balance"
      );
    });

    it("should track the session", async () => {
      await zarimInstance.deposit({ from: learner, value: deposit });

      const receipt = await zarimInstance.openSession(
        language,
        price,
        duration,
        {
          from: learner,
        }
      );

      const session = await zarimInstance.sessions.call(learner);
      session.language.toNumber().should.equal(language);
      session.price.toNumber().should.equal(price);
      session.maxDuration.toNumber().should.equal(duration);
    });

    it("should prevent learner from opening a second concurrent session", async () => {
      await expectRevert(
        zarimInstance.openSession(language, price, duration, {
          from: learner,
        }),
        "Learner has an open session"
      );
    });
  });

  describe("enter session", async () => {
    it("should not allow unregistered speakers to enter session", async () => {
      await expectRevert(
        zarimInstance.enterSession(learner, {
          from: unregisteredSpeaker,
        }),
        "Speaker is not registered"
      );
    });

    it("should not allow non-native speakers to enter session", async () => {
      await expectRevert(
        zarimInstance.enterSession(learner, {
          from: russianSpeaker,
        }),
        "Speaker is not native"
      );
    });

    it("should allow registered speaker to enter session", async () => {
      const receipt = await zarimInstance.enterSession(learner, {
        from: englishSpeaker,
      });

      const session = await zarimInstance.sessions.call(learner);
      session.speaker.should.equal(englishSpeaker);
    });
  });

  describe("closing the session", async () => {
    const language = Language.ENGLISH;
    const deposit = 100;
    const price = 1;
    const duration = 100;
    const blockTime = 50;

    it("should prevent unknown party closing the session", async () => {
      await expectRevert(
        zarimInstance.closeSession(learner, {
          from: unregisteredSpeaker,
        }),
        "Only learner or speaker can close session"
      );
    });

    it("should prevent closing a session that was never opened", async () => {
      await expectRevert(
        zarimInstance.closeSession(unregisteredSpeaker, {
          from: unregisteredSpeaker,
        }),
        "Learner has no open session"
      );
    });

    it("should lower learner's balance and increase speaker's balance upon session closure by speaker", async () => {
      const learnerPreviousBalance = await zarimInstance.balanceOf.call(
        learner
      );
      const speakerPreviousBalance = await zarimInstance.balanceOf.call(
        englishSpeaker
      );

      // call is in session
      const startingBlock = await time.latestBlock();
      const endBlock = startingBlock.addn(blockTime);
      await time.advanceBlockTo(endBlock);

      const receipt = await zarimInstance.closeSession(learner, {
        from: englishSpeaker,
      });

      const learnerCurrentBalance = await zarimInstance.balanceOf.call(learner);
      const speakerCurrentBalance = await zarimInstance.balanceOf.call(
        englishSpeaker
      );

      BN(learnerCurrentBalance).should.be.bignumber.lt(
        BN(learnerPreviousBalance)
      );
      BN(speakerCurrentBalance).should.be.bignumber.gt(
        BN(speakerPreviousBalance)
      );
    });

    it("should not allow registered speaker to enter closed session", async () => {
      await expectRevert(
        zarimInstance.enterSession(learner, {
          from: englishSpeaker,
        }),
        "Learner has no open session"
      );
    });

    it("should not charge learner for closing an open session that had no speaker", async () => {
      await zarimInstance.deposit({ from: learner, value: deposit });

      const learnerPreviousBalance = await zarimInstance.balanceOf.call(
        learner
      );

      const receipt = await zarimInstance.openSession(
        language,
        price,
        duration,
        {
          from: learner,
        }
      );

      // call is in session
      const startingBlock = await time.latestBlock();
      const endBlock = startingBlock.addn(blockTime);
      await time.advanceBlockTo(endBlock);

      await zarimInstance.closeSession(learner, {
        from: learner,
      });

      const learnerCurrentBalance = await zarimInstance.balanceOf.call(learner);
      BN(learnerCurrentBalance).should.be.bignumber.equal(
        BN(learnerPreviousBalance)
      );
    });

    it("should have two closed sessions", async () => {
      const closedSessionsCount = await zarimInstance.getClosedSessionsCount.call(
        learner
      );

      closedSessionsCount.toNumber().should.be.equal(2);
    });
  });
});
