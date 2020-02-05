const ActionStorage = artifacts.require('ActionStorage');

contract('ActionStorage', () => {
    it('Should deploy smart contract properly', async () => {
        const actionStorage = await ActionStorage.deployed();
        console.log(actionStorage.address);
        assert(actionStorage.address !== '');
    });
    it('Should save an opportunity record', async () => {
        const actionStorage = await ActionStorage.deployed();
        await actionStorage.createOpportunity('title','description','location', 'organization', 1000000, 1000000);
        const result = await actionStorage.getOpportunity(0);
        assert(result.id == 1 && result.title == 'title' && result.description == 'description' && result.location == 'location' && result.organization == 'organization' && result.startDate == 1000000 && result.endDate == 1000000);
    });
});