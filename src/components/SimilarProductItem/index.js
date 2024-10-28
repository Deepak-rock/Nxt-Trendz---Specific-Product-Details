// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props
  const {title, brand, price, rating, imageURL} = similarProducts
  return (
    <li className="similar-product-items">
      <img src={imageURL} alt={brand} className="product-item-img" />
      <p className="title-similar-product">{title}</p>
      <p className="brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
