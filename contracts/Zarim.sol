// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Zarim {
    uint256 storedData;

    enum Language {English, Spanish, Russian}
    enum Country {USA, Spain, Russia}

    mapping(address => Speaker) public speakers;
    mapping(uint8 => address[]) public nativeSpeakers;

    struct Speaker {
        address id;
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
        Speaker memory speaker = Speaker({
            id: msg.sender,
            age: _age,
            gender: _gender,
            country: _country
        });
        speakers[msg.sender] = speaker;
        nativeSpeakers[_language].push(msg.sender);
    }

    function getSpeakersCount(uint8 _language) public returns (uint256) {
        return nativeSpeakers[_language].length;
    }
}
