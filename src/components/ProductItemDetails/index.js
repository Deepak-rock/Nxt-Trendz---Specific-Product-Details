// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetailsList: [],
    similarProductsList: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  incrementCount = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decrementCount = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.id,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        imageURL: fetchedData.image_url,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products,
      }
      this.setState({
        productItemDetailsList: updatedData,
        similarProductsList: updatedData.similarProducts.map(eachProduct => ({
          id: eachProduct.id,
          title: eachProduct.title,
          price: eachProduct.price,
          description: eachProduct.description,
          imageURL: eachProduct.image_url,
          brand: eachProduct.brand,
          totalReviews: eachProduct.total_reviews,
          rating: eachProduct.rating,
          availability: eachProduct.availability,
          style: eachProduct.style,
        })),
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRenderAllProduct = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error"
        className="product-not-found-img"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <button
        className="product-not-found-btn"
        type="button"
        onClick={this.onClickRenderAllProduct}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {productItemDetailsList, similarProductsList, quantity} = this.state
    return (
      <div className="product-item-details-container">
        <div className="product-item-view">
          <img
            src={productItemDetailsList.imageURL}
            alt={productItemDetailsList.id}
            className="product-img"
          />
          <div className="product-details-container">
            <h3 className="product-title">{productItemDetailsList.title}</h3>
            <h3 className="product-price">
              Rs {productItemDetailsList.price}/-
            </h3>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{productItemDetailsList.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="product-total-review">
                {productItemDetailsList.totalReviews} Reviews
              </p>
            </div>
            <p className="product-description">
              {productItemDetailsList.description}
            </p>
            <p className="product-avaliable">
              Available:{' '}
              <span className="product-span-avaliable">
                {productItemDetailsList.availability}
              </span>
            </p>
            <p className="product-brand">
              Brand:{' '}
              <span className="product-span-brand">
                {productItemDetailsList.brand}
              </span>
            </p>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <BsPlusSquare className="icon" onClick={this.incrementCount} />
              <p className="quantity">{quantity}</p>
              <BsDashSquare className="icon" onClick={this.decrementCount} />
            </div>
            <button className="add-to-card-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <div className="similar-product">
            <h1 className="similar-heading">Similar Product</h1>
            <ul className="similar-product-list">
              {similarProductsList.map(eachProductItem => (
                <SimilarProductItem
                  key={eachProductItem.id}
                  similarProducts={eachProductItem}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProducts()}
      </>
    )
  }
}
export default ProductItemDetails
