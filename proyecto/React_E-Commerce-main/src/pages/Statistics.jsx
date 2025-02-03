import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Sidebar } from "../components";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import API_URL from "../config";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Spinner from '../components/Spinner.jsx';


const Statistics = () => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [leastSoldProducts, setLeastSoldProducts] = useState([]);
    const [chartData, setChartData] = useState(null);

    const createChartData = useCallback((data) => {
        const labels = data.map(item => item.Month);
        const values = data.map(item => parseFloat(item.TotalProductsSold) || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Productos Vendidos por Mes',
                    data: values,
                    backgroundColor: 'rgba(255, 136, 0, 0.6)',
                    borderColor: 'rgb(26, 79, 105)',
                    borderWidth: 1,
                },
            ],
        };
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const mostSoldResponse = await axios.get(`${API_URL}/topProductosVendidos`);
                const leastSoldResponse = await axios.get(`${API_URL}/topProductosMenosVendidos`);

                setMostSoldProducts(mostSoldResponse.data);
                setLeastSoldProducts(leastSoldResponse.data);
            } catch (error) {
                console.error("Error al obtener los productos más y menos vendidos:", error);
            }
        };

        const fetchProductsSoldByMonth = async () => {
            try {
                const response = await axios.get(`${API_URL}/productosVendidos`);
                const data = response.data;

                setChartData(createChartData(data));
            } catch (error) {
                console.error("Error al obtener datos de ventas:", error);
            }
        };

        fetchTopProducts();
        fetchProductsSoldByMonth();
    }, [createChartData]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas Totales por Mes' },
        },
        scales: {
            y: {
                beginAtZero: true, 
            },
        },
    };

    const ProductList = ({ title, products }) => (
        <div className="col-md-6 mt-4">
            <h5 className="text-primary">{title}</h5>
            <ul className="list-group">
                {products.map(product => (
                    <li
                        key={product.ProductId}
                        className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{product.Name}</strong> - ${product.Price.toFixed(2)}
                        </div>
                        <span className="badge bg-success rounded-pill">{product.soldCount} vendidos</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="container">
                <div className="row">
                    <ProductList title="Productos más vendidos" products={mostSoldProducts} />
                    <ProductList title="Productos menos vendidos" products={leastSoldProducts} />
                </div>
                <div className="mt-5 text-center">
                    <h2>Estadísticas de Ventas</h2>
                    {chartData ? (
                        <Bar data={chartData} options={options} />
                    ) : (
                        <Spinner />
                    )}
                </div>
            </div>
        </>
    );
};

export default Statistics;
