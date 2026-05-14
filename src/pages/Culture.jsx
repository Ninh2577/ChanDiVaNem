import React from 'react';
import Hero from '../components/Hero';
import Festivals from '../components/Festivals';
import Villages from '../components/Villages';
import PeopleLife from '../components/PeopleLife';
import Newsletter from '../components/Newsletter';
import './Culture.css';

const Culture = () => {
  return (
    <div className="culture-page">
      <Hero />
      <Festivals />
      <Villages />
      <PeopleLife />
      <Newsletter />
    </div>
  );
};

export default Culture;
