import React, { useState, useEffect, useDebugValue } from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import moment from 'moment'
import Swal from 'sweetalert2'
import {DatePicker} from 'react-materialize'

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

export default function OpportunityDetails(props) {
    
    const { drizzle } = useDrizzle();
    const state = useDrizzleState(state => state);
    const stateApp = {
        buffer: null,
        resourceHash: '',
        opportunityId: 0,
        actions: []
    };

    const [opportunity, setOpportunity] = useState()
    const [actions, setActions] = useState()
    
    const IPFS = require('ipfs-api');
    const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001,protocol: 'https' });

    const opportunityId = props.match.params.id - 1
    stateApp['opportunityId'] = parseInt(props.match.params.id -1)

    async function getOpportunities() {
        const newOpportunity = await drizzle.contracts.ActionStorage.methods.getOpportunity(opportunityId).call();
        newOpportunity['startDateString'] = moment.unix(newOpportunity.startDate).format("MM-DD-YYYY");
        newOpportunity['endDateString'] = moment.unix(newOpportunity.endDate).format("MM-DD-YYYY");

        setOpportunity(newOpportunity);
    }

    async function getActions() {
        const actionIdsByComma = await drizzle.contracts.ActionStorage.methods.getActionIdsByOpportunity(opportunityId).call();
        var actionIds = actionIdsByComma.split(',');
        if(actionIds.length > 0) {
            actionIds.forEach(async (actionId) => {
                const action = await drizzle.contracts.ActionStorage.methods.getAction(actionId).call();      
                action['registerDateString'] = moment.unix(action.registerDate).format("MM-DD-YYYY");          
                stateApp['actions'].push(action);
            });
        }
        setActions(stateApp['actions'])          
    }

    useEffect( () => {    
        getActions()           
        getOpportunities()
        
    }, []);

    const handleChange = (e) => {
        if(e.target.id === "registerDate") {
            var newDate = moment(e.target.value, 'YYYY-MM-DD').unix()
            stateApp[e.target.id] = newDate
        } else {
            stateApp[e.target.id] = e.target.value
        }     
    }

    const handleChangeDate = (date, name) => {
        stateApp[name] = moment(date, 'YYYY-MM-DD').unix();
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const captureFile = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            stateApp['buffer'] = Buffer(reader.result)
        }
    }

    const sendToIpfs = async () => {

        const transaction = await ipfs.add(stateApp['buffer'], (error, result) => {
            stateApp['resourceHash'] = result[0].hash
            if(error) {
                console.error(error)
                return
            }
            document.getElementById('ipfs_button')
            document.getElementById('ipfs_button').disabled = true
        })
        return transaction;   
    }

    const sendToContract = async () => {
        if (state.drizzleStatus.initialized) {            
            const transaction = await drizzle.contracts.ActionStorage.methods.createAction(
                stateApp['opportunityId'],
                stateApp['registerDate'],
                stateApp['description'],
                stateApp['resourceHash']).send({from: state.accounts[0]})
            
            if(transaction.status) {
                Swal.fire({
                    title: "Yeah!",
                    text: 'Action added to the blockchain!',
                    type: "success"
                });
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: 'Error adding to the blockchain!',
                    type: "error"
                });
            }
        } 
    }

    const createAction = async () => {

        const ipfsPromise = sendToIpfs();
        ipfsPromise.then(() => {
            sendToContract();
        })          
    }

    function ColumnResource(props) {
    return <td><img src={`https://ipfs.infura.io/ipfs/${props.resourceHash}`} /></td>;
    }

    function RenderResource(props) {
        const resourceHash = props.resourceHash;
        if (resourceHash && resourceHash.length > 0) {
          return <ColumnResource resourceHash={resourceHash} />;
        }
        return <td>...</td>;
      }

    return opportunity ? (
        <div className="container section opportunity-details">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">{opportunity.title}</span>
                    <p>Description: {opportunity.description}</p>
                    <p>Location: {opportunity.location}</p>
                    <p>Organization: {opportunity.organization}</p>
                    <p className="grey-text">Start date: {opportunity.startDateString} - End date: {opportunity.endDateString}</p>
                </div>
                <div className="card-action grey lighten-4 grey-text">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <h5 className="grey-text text-darken-3">Create Action</h5>
                            <div className="input-field">
                                <label htmlFor="registerDate">Register date</label>
                                <DatePicker id="registerDate" onChange={(date)=>handleChangeDate(date, 'registerDate')} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="description">Description</label>
                                <input type="text" id="description" onChange={handleChange} />
                            </div>
                            <div className="input-fields">
                                <input type="file" onChange={captureFile} />
                                <button id="ipfs_button" onClick={sendToIpfs} className="btn default">Send to IPFS</button>
                            </div>
                            <div className="input-field">
                                <button value="Submit" onClick={createAction} className="btn pink lighten-1 z-depth-0">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col s12 m12">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Record</th>
                                        <th>Description</th>
                                        <th>Resource</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions.map(action => (
                                        <tr key={action.id}>
                                            <td>{action.registerDateString}</td>
                                            <td>{action.description}</td>
                                            <RenderResource resourceHash={action.resourceHash} />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    ) : (
        <div>Loading...</div>
    );
}