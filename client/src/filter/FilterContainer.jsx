import React, { Component } from 'react';

import FilterMenu from './FilterMenu'
import SpaceFilter from './SpaceFilter';
import TimeFilter from './TimeFilter';
import FacetFilter from './FacetFilter';

import { exampleFacets2, metaFacetsConverter } from '../utils/filterUtils'

class App extends Component {
    render() {

        const filterSections = [
            {
                heading: 'Space',
                content: <SpaceFilter />
            },
            {
                heading: 'Time',
                content: <TimeFilter />
            },
            {
                heading: 'Keywords',
                content: <FacetFilter facets={exampleFacets2} />
            },
        ];

        return (
            <div className="App">
                <FilterMenu sections={filterSections} />
            </div>
        );
    }
}

export default App;
