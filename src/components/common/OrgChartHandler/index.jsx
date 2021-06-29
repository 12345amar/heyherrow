import React, { useEffect, useRef, useState } from 'react';
import OrgChart from '@balkangraph/orgchart.js';
import PropTypes from 'prop-types';

const MyChart = (props) => {
  const divRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [_, setChart] = useState({});

  // eslint-disable-next-line react/prop-types
  const { nodes } = props;

  useEffect(() => {
    OrgChart.templates.ula.size = [220, 90];
    OrgChart.templates.ula.link = '<path stroke-dasharray="4, 2" stroke="#616161" stroke-width="1px" fill="none" d="{edge}" />';
    OrgChart.templates.ula.node = '<rect x="0" y="0" height="90" width="220" fill="#fcc89b" rx="4" ry="4"></rect>'
    + '<rect x="0" y="65" height="25" width="{w}" fill="#ccc" stroke-width="0" stroke="#ccc" rx="4" ry="4" class="field_rec_2"></rect>'
    + '<circle cx="35" cy="30" r="20" fill="#d1d2d4" stroke="#fff" stroke-width="0" class="field_3"></circle>';
    OrgChart.templates.ula.field_0 = '<text width="220" style="font-size: 14px; font-weight: 700" fill="#ffffff" x="70" y="25" text-anchor="start" class="field_0">{val}</text>';
    OrgChart.templates.ula.field_1 = '<text width="220" style="font-size: 13px; font-weight: 400" fill="#ffffff" x="70" y="45" text-anchor="start" class="field_1">{val}</text>';
    OrgChart.templates.ula.field_2 = '<text width="220" style="font-size: 12px; font-weight: 500" fill="#ffffff" x="110" y="82" text-anchor="middle" class="field_2">{val}</text>';
    OrgChart.templates.ula.field_3 = '<text width="220" style="font-size: 12px; font-weight: 700" fill="#ffffff" x="35" y="35" text-anchor="middle" class="field_3">{val}</text>';
    const chartData = new OrgChart(divRef.current, {
      nodes,
      nodeBinding: {
        field_0: 'name',
        field_1: 'post',
        field_2: 'sales',
        field_3: 'img',
      },
      template: 'ula',
      toolbar: {
        fullScreen: false,
        zoom: true,
        fit: false,
        expandAll: false,
        search: false
      }
    });
    setChart(chartData);
  }, [nodes]);

  return (
    <div id="tree" ref={divRef} />
  );
};

const OrgChartHandler = React.memo(MyChart);

OrgChartHandler.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OrgChartHandler;
