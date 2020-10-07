// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Zarim {
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
        address speaker;
        uint8 language;
        uint256 price;
        uint256 start;
        uint256 maxDuration;
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

    event AcceptSession(address indexed _learner, address indexed _speaker);

    event TerminateSession(
        address indexed _learner,
        address indexed _speaker,
        uint256 indexed _total
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

    function initiateSession(
        uint8 _language,
        uint256 _price,
        uint256 _duration
    ) public {
        require(balanceOf[msg.sender] > 0, "Learner has no balance");
        Session memory session = Session({
            speaker: address(0x0),
            language: _language,
            price: _price,
            start: 0,
            maxDuration: _duration
        });

        sessions[msg.sender] = session;

        emit InitiateSession(msg.sender, _language, _price);
    }

    function acceptSession(address _learner) public {
        require(
            speakers[msg.sender].id == msg.sender,
            "Speaker is not registered"
        );

        Session storage session = sessions[_learner];
        session.speaker = msg.sender;
        session.start = block.timestamp;

        emit AcceptSession(_learner, msg.sender);
    }

    function terminateSession(address _learner) public {
        Session memory session = sessions[_learner];

        require(
            msg.sender == _learner || msg.sender == session.speaker,
            "Only learner or speaker can terminate session"
        );

        // charge learner for session
        uint256 duration = block.timestamp - session.start;
        uint256 total = session.price * duration;
        balanceOf[_learner] -= total;
        balanceOf[session.speaker] += total;

        delete sessions[_learner];

        emit TerminateSession(_learner, session.speaker, total);
    }
}
