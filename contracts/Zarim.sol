// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Zarim {
    using SafeMath for uint256;

    mapping(address => Speaker) public speakers;
    mapping(uint8 => address[]) public nativeSpeakers;
    mapping(address => uint256) public balanceOf;
    mapping(address => Session) public sessions;
    mapping(address => Session[]) public closedSessions;

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
        bool open;
    }

    event Register(
        address indexed _speaker,
        uint8 indexed _country,
        uint8[] indexed _languages
    );

    event OpenSession(
        address indexed _learner,
        uint8 indexed _language,
        uint256 indexed _price
    );

    event EnterSession(address indexed _learner, address indexed _speaker);

    event CloseSession(
        address indexed _learner,
        address indexed _speaker,
        uint256 _duration,
        uint256 indexed _total
    );

    modifier noOpenSession() {
        require(!sessions[msg.sender].open, "Learner has an open session");
        _;
    }

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
        balanceOf[msg.sender] = balanceOf[msg.sender].add(msg.value);
    }

    function withdraw() public {
        uint256 amount = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    function openSession(
        uint8 _language,
        uint256 _price,
        uint256 _duration
    ) public noOpenSession {
        require(
            balanceOf[msg.sender] >= _price.mul(_duration),
            "Insufficient balance"
        );
        Session memory session = Session({
            speaker: address(0x0),
            language: _language,
            price: _price,
            start: 0,
            maxDuration: _duration,
            open: true
        });

        sessions[msg.sender] = session;

        emit OpenSession(msg.sender, _language, _price);
    }

    function enterSession(address _learner) public {
        require(
            speakers[msg.sender].id == msg.sender,
            "Speaker is not registered"
        );

        Session storage session = sessions[_learner];
        session.speaker = msg.sender;
        session.start = block.timestamp;

        emit EnterSession(_learner, msg.sender);
    }

    function closeSession(address _learner) public {
        Session memory session = sessions[_learner];

        require(
            msg.sender == _learner || msg.sender == session.speaker,
            "Only learner or speaker can close session"
        );

        // charge learner for session with a speaker
        uint256 duration;
        uint256 total;
        if (session.speaker != address(0x0)) {
            duration = block.timestamp.sub(session.start);
            total = session.price.mul(duration);
            balanceOf[_learner] = balanceOf[_learner].sub(total);
            balanceOf[session.speaker] = balanceOf[session.speaker].add(total);
        }

        session.open = false;
        closedSessions[_learner].push(session);

        delete sessions[_learner];

        emit CloseSession(_learner, session.speaker, duration, total);
    }

    function getClosedSessionsCount(address _learner) public returns (uint256) {
        return closedSessions[_learner].length;
    }
}
