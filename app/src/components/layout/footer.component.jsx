import React from 'react'
import logoConsensys from '../../consensys.svg'

const Footer = () => {
    return (
        <footer className="page-footer">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="white-text"><img src={logoConsensys} alt="consensys-logo" style={{ width: "10%" }} /></h5>
                        <p className="grey-text text-lighten-4">Project of Consensys Academy, cohort December 2019.</p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h5 className="white-text">Links</h5>
                        <ul>
                            <li><a className="grey-text text-lighten-3" href="https://github.com/nestorbonilla">Github</a></li>
                            <li><a className="grey-text text-lighten-3" href="https://www.instagram.com/nesbonilla/">Instagram</a></li>
                            <li><a className="grey-text text-lighten-3" href="https://www.linkedin.com/in/nestorbonilla/">Linked Inn</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                © {(new Date().getFullYear())} Developed by Nestor Bonilla
                </div>
            </div>
        </footer>
    )
}

export default Footer;