import { useEffect, useState } from "react"
import Header from "../components/Header"
import axios from "axios"
import '../style/ProductList.css'
import { Link, useNavigate } from "react-router-dom"
import Search from "../components/Search"



export default function List() {

    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([])
    const [search, setSearch] = useState([])


    const history = useNavigate();



    useEffect( () => {
        const getCategory = () => {
            axios.get('https://dummyjson.com/products/categories')
            .then(res => {
                const halfDataIndex = Math.ceil(res.data.length / 2);
                const halfData = res.data.slice(0, halfDataIndex);
                setCategories(halfData)
            }) 
            .catch(err => {
                console.error(err);
            })
        }
        getCategory()
    },[])


    const GoToCategory = async(route) => {
        try {
            await axios.get(`https://dummyjson.com/products/category/${route}`)
            .then(res => {
                setData(res.data.products)
                setSearch(res.data.products)

                history(`/productlist/${route}`);
            })
            .catch(error => {
                console.log('Error fetching data:', error);
              });
            
        } catch (error) {
            console.log(error)
        }
        
    }


    useEffect(() => {
        const currentRoute = window.location.pathname.split('/productlist/')[1];
        if (currentRoute) {
            GoToCategory(currentRoute);
        }
    },[])



    return(
        <>
            <Header/>
            <section className="list">
                <nav className="choosePosition">
                    {categories.map((el) => (
                            <div key={el}>
                                <button className="prodCategore" onClick={() => GoToCategory(el)}>
                                    {el}
                                </button>
                            </div>
                        
                    ))}
                </nav>

                <Search products={data} setSearch={setSearch}/>

                <div className="mainTovar">
                    {search.map((prod) => ( 
                        <div className="tovar" key={prod.id}>
                            <div className="up">
                                <img src={prod.thumbnail} alt="" className="thumbnail"/>
                                <span>{prod.title}</span>
                            </div>
                            <div className="down">
                                <span>price: {prod.price} $</span>
                                <Link to={`/productlist/product/${prod.id}`}>
                                    <button className="glow-on-hover">show</button>
                                </Link>
                                
                            </div>
                        </div>
                    ))}
                </div>
                
            </section>
        </>
    )
}