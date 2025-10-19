// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol"; // For contract ownership

contract EventManager is Ownable {
    struct Event {
        address organizer;
        uint32 assetThreshold; // Using uint32 to match GoldenTicketVerification
        string eventName;
        uint256 expiryTime; // Unix timestamp
        bool isActive;
        uint256 eventId; // Unique ID for the event
    }

    mapping(uint256 => Event) public events;
    uint256 public nextEventId;

    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        uint32 assetThreshold,
        string eventName,
        uint256 expiryTime
    );
    event EventUpdated(
        uint256 indexed eventId,
        uint32 newAssetThreshold,
        string newEventName,
        uint256 newExpiryTime,
        bool newIsActive
    );

    constructor(address initialOwner) Ownable(initialOwner) {
        nextEventId = 1; // Start event IDs from 1
    }

    function createEvent(
        uint32 _assetThreshold,
        string memory _eventName,
        uint256 _expiryTime
    ) public returns (uint256) {
        require(_expiryTime > block.timestamp, "EventManager: Expiry time must be in the future");
        require(bytes(_eventName).length > 0, "EventManager: Event name cannot be empty");

        uint256 eventId = nextEventId;
        events[eventId] = Event(
            msg.sender,
            _assetThreshold,
            _eventName,
            _expiryTime,
            true, // isActive by default
            eventId
        );
        nextEventId++;

        emit EventCreated(eventId, msg.sender, _assetThreshold, _eventName, _expiryTime);
        return eventId;
    }

    function updateEvent(
        uint256 _eventId,
        uint32 _newAssetThreshold,
        string memory _newEventName,
        uint256 _newExpiryTime,
        bool _newIsActive
    ) public {
        Event storage eventToUpdate = events[_eventId];
        require(eventToUpdate.organizer == msg.sender, "EventManager: Only event organizer can update");
        require(_newExpiryTime > block.timestamp, "EventManager: Expiry time must be in the future");
        require(bytes(_newEventName).length > 0, "EventManager: Event name cannot be empty");

        eventToUpdate.assetThreshold = _newAssetThreshold;
        eventToUpdate.eventName = _newEventName;
        eventToUpdate.expiryTime = _newExpiryTime;
        eventToUpdate.isActive = _newIsActive;

        emit EventUpdated(_eventId, _newAssetThreshold, _newEventName, _newExpiryTime, _newIsActive);
    }

    function getEvent(uint256 _eventId) public view returns (Event memory) {
        require(events[_eventId].eventId != 0, "EventManager: Event does not exist");
        return events[_eventId];
    }

    // Function to deactivate an event (e.g., if it's finished or cancelled)
    function deactivateEvent(uint256 _eventId) public {
        Event storage eventToDeactivate = events[_eventId];
        require(eventToDeactivate.organizer == msg.sender, "EventManager: Only event organizer can deactivate");
        require(eventToDeactivate.isActive, "EventManager: Event is already inactive");
        eventToDeactivate.isActive = false;
        emit EventUpdated(_eventId, eventToDeactivate.assetThreshold, eventToDeactivate.eventName, eventToDeactivate.expiryTime, false);
    }
}
