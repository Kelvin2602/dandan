import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const defaultDesc = "长安仁爱慈善基金会官方网站 - 文化传承，人道救助";
  const siteTitle = "长安仁爱慈善基金会";

  return (
    <Helmet>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={`${title} | ${siteTitle}`} />
      <meta property="og:description" content={description || defaultDesc} />
    </Helmet>
  );
};