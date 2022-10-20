import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const searchStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  successful: 'SUCCESSFUL',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    loadingStatus: searchStatus.initial,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({})
    this.setState({
      loadingStatus: searchStatus.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, rating, category} = this.state
    // const apiUrl = 'https://apis.ccbp.in/products?sort_by=PRICE_HIGH&category=2&title_search=&rating=4'
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        loadingStatus: searchStatus.successful,
      })
    } else {
      this.setState({loadingStatus: searchStatus.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    // TODO: Add No Products View
    const noProductView = () => (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <p>No Products Found</p>
        <p>We could not found any products. Try other filters</p>
      </div>
    )

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length !== 0 ? (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        ) : (
          noProductView()
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  filterCategory = category => {
    // console.log('eachCategoryCategoryId', category)
    this.setState({category}, this.getProducts)
  }

  filteringRating = rating => {
    // console.log('rating', rating)
    this.setState({rating}, this.getProducts)
  }

  //   consoling = event => {
  //     this.setState({keyButton: event.key})
  //   }

  filteringSearch = event => {
    // const {keyButton} = this.state
    // console.log('key button', keyButton)
    // document.addEventListener('keydown', this.consoling)
    this.setState({titleSearch: event.target.value})
    // if (keyButton === 'enter') {
    //   this.setState({titleSearch: event.target.value}, this.getProducts)
    // }
  }

  enteringSearch = () => {
    this.getProducts()
    // here we want to implement search only after clicking enter button. so we didnt call thes.getProducts in onChange
  }

  onClickClearButton = () => {
    this.setState({rating: '', titleSearch: '', category: ''}, this.getProducts)
  }

  // TODO: Add failure view
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble processing your request.Please try again</p>
    </div>
  )

  getResultView = () => {
    const {loadingStatus} = this.state

    switch (loadingStatus) {
      case searchStatus.loading:
        return this.renderLoader()
      case searchStatus.successful:
        return this.renderProductsList()
      case searchStatus.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {titleSearch} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          filterCategory={this.filterCategory}
          filteringRating={this.filteringRating}
          filteringSearch={this.filteringSearch}
          onClickClearButton={this.onClickClearButton}
          titleSearch={titleSearch}
          enteringSearch={this.enteringSearch}
        />
        {this.getResultView()}
      </div>
    )
  }
}

export default AllProductsSection
