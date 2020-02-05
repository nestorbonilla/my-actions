pragma solidity >=0.4.21 <0.7.0;
import "./Stoppable.sol";

/*
 * The ActionStorage contract keeps track of the actions activist do after their participation of an opportunity (i.e. grant, scholarship, trip, etc).
 *
 * At the bottom of the contract you will find auxiliar functions upgraded and updated to work
 * properly with current comiler versions
 *
 * The original functions were published by
 * @author James Lockhart <james@n3tw0rk.co.uk>
*/

contract ActionStorage is Stoppable {

    /*_____________________________
     * 1. Variable Definitions
     *_____________________________
     */

    // Platform account address
    address public platformOwner;
    Opportunity[] public opportunities;
    Action[] public actions;
    uint public opportunityCount;
    mapping (uint => string[]) actionIds;

    constructor() public {
        /* Set platformOwner to the creator of this contract */
        platformOwner = msg.sender;
    }

    struct Opportunity {
        uint id;
        string title;
        string description;
        string location;
        string organization;
        uint startDate;
        uint endDate;
    }

    struct Action {
        string id;
        uint opportunityId;
        uint registerDate;
        string description;
        string resourceHash;
    }

    /*_____________________________
     * 2. Modifiers
     *_____________________________
     */

    modifier isPlatformOwner {
        require(msg.sender == platformOwner, 'Platform owner not verified');
        _;
    }

    /*_____________________________
     * 3. Event Logs
     *_____________________________
     */

    event LogNewOpportunity(uint indexed id);
    event LogNewAction(string id);

     /*_____________________________
     * 4. Function definition
     *_____________________________
     */

    function getOpportunity(uint opportunityId)
        public
        view
        returns (
            uint id,
            string memory title,
            string memory description,
            string memory location,
            string memory organization,
            uint startDate,
            uint endDate)
    {
        Opportunity memory opportunity = opportunities[opportunityId];
        id = opportunity.id;
        title = opportunity.title;
        description = opportunity.description;
        location = opportunity.location;
        organization = opportunity.organization;
        startDate = opportunity.startDate;
        endDate = opportunity.endDate;
    }

    function createOpportunity(
        string memory title,
        string memory description,
        string memory location,
        string memory organization,
        uint startDate,
        uint endDate)
    public
    whenRunning
    whenAlive
    {
        opportunityCount++;
        opportunities.push(Opportunity(opportunityCount, title, description, location, organization, startDate, endDate));
        emit LogNewOpportunity(opportunityCount);
    }

    function getActionIdsByOpportunity(uint opportunityId)
        public
        view
        returns (string memory actionIdsByComma)
    {
        string[] memory currentActionIds = actionIds[opportunityId];
        for (uint index = 0; index < currentActionIds.length; index++) {
            if(length(actionIdsByComma) > 0) {
                actionIdsByComma = concatStrings(actionIdsByComma, concatStrings(',', currentActionIds[index]));
            } else {
                actionIdsByComma = currentActionIds[index];
            }
        }
    }

    function getAction(
        string memory actionId)
    public
    view
    whenRunning
    whenAlive
        returns (
            string memory id,
            uint parentId,
            uint registerDate,
            string memory description,
            string memory resourceHash)
    {
        for (uint y = 0; y < actions.length; y++) {
            if (compareTo(actions[y].id, actionId)) {
                id = actions[y].id;
                parentId = actions[y].opportunityId;
                registerDate = actions[y].registerDate;
                description = actions[y].description;
                resourceHash = actions[y].resourceHash;
            }
        }
    }

    function createAction(
        uint opportunityId,
        uint registerDate,
        string memory description,
        string memory resourceHash)
    public
    whenRunning
    whenAlive
    {
        //Setting compound id to mapping of string array
        uint actionCount = actionIds[opportunityId].length;
        string memory opportunityIdString = convertIntToString(opportunityId);
        string memory actionCountString = convertIntToString(actionCount);
        string memory actionId = concatStrings(opportunityIdString, concatStrings(".", actionCountString));
        actionIds[opportunityId].push(actionId);

        actions.push(Action(actionId, opportunityId, registerDate, description, resourceHash));
        emit LogNewAction(actionId);
    }

    /*_____________________________
     * 5. Auxiliary functions
     *_____________________________
     */

    function convertIntToString(uint256 _number)
    internal
    pure
    returns (string memory) {
        uint256 _tmpN = _number;

        if (_tmpN == 0) {
            return "0";
        }

        uint256 j = _tmpN;
        uint256 length = 0;

        while (j != 0){
            length++;
            j /= 10;
        }

        bytes memory bstr = new bytes(length);

        uint256 k = length - 1;

        while (_tmpN != 0) {
            bstr[k--] = byte(uint8(48 + _tmpN % 10));
            _tmpN /= 10;
        }

        return string(bstr);

    }

    function concatStrings(string memory _base, string memory _value)
        internal
        pure
        returns (string memory) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length > 0);

        string memory _tmpValue = new string(_baseBytes.length +
            _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for (i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for (i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }

    function compareTo(string memory _base, string memory _value)
        internal
        pure
        returns (bool) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        if (_baseBytes.length != _valueBytes.length) {
            return false;
        }

        for (uint i = 0; i < _baseBytes.length; i++) {
            if (_baseBytes[i] != _valueBytes[i]) {
                return false;
            }
        }

        return true;
    }

    function length(string memory _base)
        internal
        pure
        returns (uint) {
        bytes memory _baseBytes = bytes(_base);
        return _baseBytes.length;
    }
}