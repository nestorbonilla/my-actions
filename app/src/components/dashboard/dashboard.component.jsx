import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { drizzleReactHooks } from "@drizzle/react-plugin"
import moment from 'moment'

const { useDrizzle } = drizzleReactHooks;

export default function Dashboard() {
    
    const { drizzle } = useDrizzle();
    const state = useDrizzle(state => state);

    const [opportunities, setOpportunities] = useState();

    async function getOpportunities() {
        const opportunityCount = await drizzle.contracts.ActionStorage.methods.opportunityCount().call()
        const opportunitiesJSON = [];
        for (let index = 0; index < opportunityCount; index++) {
            const newOpportunity = await drizzle.contracts.ActionStorage.methods.getOpportunity(index).call();
            newOpportunity['startDateString'] = moment.unix(newOpportunity.startDate).format("MM-DD-YYYY");
            newOpportunity['endDateString'] = moment.unix(newOpportunity.endDate).format("MM-DD-YYYY");
            opportunitiesJSON.push(newOpportunity);    
        }
        setOpportunities(opportunitiesJSON);
      }

    useEffect(() => {
        getOpportunities();
      }, []);

    return opportunities ? (
        <div className="dashboard container">
            <div className="row">
                <div className="col s12 m12">
                    <div className="opportunity-list section">
                        {opportunities.map(opportunity => (
                            <div key={opportunity.id} className="card project-summary">
                                <div key={opportunity.id} className="card-content grey-text text-darken-3">
                                    <span className="card-title"><Link to={`/opportunity/${ opportunity.id }`} >{opportunity.title}</Link></span>
                                    <p>Description: {opportunity.description}</p>
                                    <p>Location: {opportunity.location}</p>
                                    <p>Organization: {opportunity.organization}</p>
                                    <p className="grey-text">Start date: {opportunity.startDateString} - End date: {opportunity.endDateString}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    );
}