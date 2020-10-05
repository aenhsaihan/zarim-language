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

    event Register(
        address indexed _speaker,
        uint8 indexed _country,
        uint8[] indexed _languages
    );

    function registerSpeaker(
        uint8 _age,
        uint8 _gender,
        uint8 _country,
        uint8[] memory _languages
    ) public {
        require(
            speakers[msg.sender].id == address(0x0),
            "Speaker is already registered"
        );
        Speaker memory speaker = Speaker({
            id: msg.sender,
            age: _age,
            gender: _gender,
            country: _country
        });
        speakers[msg.sender] = speaker;

        for (uint8 i = 0; i < _languages.length; i++) {
            nativeSpeakers[_languages[i]].push(msg.sender);
        }

        emit Register(msg.sender, _country, _languages);
    }

    function getSpeakersCount(uint8 _language) public view returns (uint256) {
        return nativeSpeakers[_language].length;
    }
}
