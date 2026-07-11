import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Festivals from '../components/Festivals';
import Villages from '../components/Villages';
import PeopleLife from '../components/PeopleLife';
import Newsletter from '../components/Newsletter';
import './Culture.css';

const Culture = () => {
  useEffect(() => {
    // Tối ưu SEO cho trang Văn hóa
    document.title = "Văn hóa - Bản sắc và Di sản đất Việt | Chân Đi Và Nếm";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Góc nhìn sâu sắc về các lễ hội truyền thống, làng nghề lâu đời và đời sống văn hóa tinh thần đa dạng của con người Việt Nam.";
  }, []);

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
