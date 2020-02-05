import React from 'react'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import moment from 'moment'
import Swal from 'sweetalert2'
import {DatePicker} from 'react-materialize'

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

function OpportunityCreate() {
    
    const { drizzle } = useDrizzle();
    const state = useDrizzleState(state => state);
    const stateApp = {};

    const handleChange = (e, x) => {
        if(e.target.id === "startDate" || e.target.id === "endDate") {
            var newDate = moment(e.target.value, 'YYYY-MM-DD').unix();
            stateApp[e.target.id] = newDate;
        } else {
            stateApp[e.target.id] = e.target.value;
        }     
    }

    const handleChangeDate = (date, name) => {
        stateApp[name] = moment(date, 'YYYY-MM-DD').unix();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const createOpportunity = async () => {

        // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
        if (state.drizzleStatus.initialized) {
 
            const count = await drizzle.contracts.ActionStorage.methods.opportunityCount.call()
            const transaction = await drizzle.contracts.ActionStorage.methods.createOpportunity(
                stateApp['title'],
                stateApp['description'],
                stateApp['location'],
                stateApp['organization'],
                stateApp['startDate'],
                stateApp['endDate']).send({from: state.accounts[0]})
            
            if(transaction.status) {
                Swal.fire({
                    title: "Yeah!",
                    text: 'Opportunity added to the blockchain!',
                    type: "success"
                }).then(function() {
                    window.location = "/";
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

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Create Opportunity</h5>
                <div className="input-field">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="organization">Organization</label>
                    <input type="text" id="organization" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker onChange={(date)=>handleChangeDate(date, 'startDate')} />
                </div>

                <div className="input-field">
                    <label htmlFor="endDate">End Date</label>
                    <DatePicker id="endDate" onChange={(date)=>handleChangeDate(date, 'endDate')} />
                </div>
                <div className="input-field">
                    <button value="Submit" onClick={createOpportunity} className="btn pink lighten-1 z-depth-0">Create</button>
                </div>
            </form>
        </div>
    )

}

export default OpportunityCreate