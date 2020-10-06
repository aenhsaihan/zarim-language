// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Zarim {
    uint256 storedData;

    enum Language {English, Spanish, Russian}
    enum Country {USA, Spain, Russia}

    mapping(address => Speaker) public speakers;
    mapping(uint8 => address[]) public nativeSpeakers;
    mapping(address => uint256) public balanceOf;
    mapping(address => Session) public sessions;

    struct Speaker {
        address id;
        uint8 age;
        uint8 gender;
        uint8 country;
    }

    struct Session {
        uint8 language;
        uint256 price;
    }

    event Register(
        address indexed _speaker,
        uint8 indexed _country,
        uint8[] indexed _languages
    );

    event InitiateSession(
        address indexed _learner,
        uint8 indexed _language,
        uint256 indexed _price
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

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 amount = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    function initiateSession(uint8 _language, uint256 _price) public {
        require(balanceOf[msg.sender] > 0, "Learner has no balance");
        Session memory session = Session({language: _language, price: _price});

        sessions[msg.sender] = session;

        emit InitiateSession(msg.sender, _language, _price);
    }
}
