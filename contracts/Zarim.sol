// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Zarim {
    uint256 storedData;

    enum Language {English, Spanish, Russian}
    enum Country {USA, Spain, Russia}

    mapping(uint8 => Speaker[]) public nativeSpeakers;

    struct Speaker {
        address id;
        uint8[] nativeLanguages;
        // uint8[] targetLanguages;
        // mapping(uint8 => uint256) nativePrices;
        // mapping(uint8 => uint256) targetPrices;
        uint8 age;
        uint8 gender;
        uint8 country;
    }

    function registerSpeaker(
        uint8 _age,
        uint8 _gender,
        uint8 _country,
        uint8 _language
    ) public {
        uint8[] memory _nativeLanguages = new uint8[](1);
        _nativeLanguages[0] = _language;

        Speaker memory speaker = Speaker({
            id: msg.sender,
            age: _age,
            gender: _gender,
            country: _country,
            nativeLanguages: _nativeLanguages
        });
        nativeSpeakers[_language].push(speaker);
    }
}
