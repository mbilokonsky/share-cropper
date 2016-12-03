import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>CREATE DATA</h2>
          <Link to="/lens">Create New Lens</Link>
          <br />
          <Link to='/dataset'>Create Dataset</Link>
          <br />
          <Link to='/editDataset'>Process Dataset</Link>
        </div>
      </div>
    );
  }
}
