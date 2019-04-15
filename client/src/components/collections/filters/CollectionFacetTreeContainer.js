import {connect} from 'react-redux'
import FacetTree from '../../common/filters/facet/FacetTree'

import {withRouter} from 'react-router'

const mapStateToProps = state => {
  return {
    loading: state.ui.loading,
  }
}

const CollectionFacetTreeContainer = withRouter(
  connect(mapStateToProps)(FacetTree)
)

export default CollectionFacetTreeContainer
