import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters';
import Chart from 'react-apexcharts';
import { barOptions, pieOptions } from './chart-options';
import axios from 'axios';
import {buildBarSeries, getPlatformChartData, getGenderChartData, } from './helpers';

import './styles.css';

type PieChartData = {
    labels: string[];
    series: number[];
}

type BarChartData = {
    x: string;
    y: number;
}

const initalPieData = {
    labels: [],
    series: []
}

const BASE_URL = 'https://sds1-fabricioleonard.herokuapp.com';

const Charts = () => {

    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformData, setPlatformData] = useState<PieChartData>(initalPieData);
    const [genderData, setGenderData] = useState<PieChartData>(initalPieData);

    useEffect(() => {
        async function getData() {
            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gamesResponse = await axios.get(`${BASE_URL}/games`);
            const barData = buildBarSeries(gamesResponse.data,  recordsResponse.data.content);
            const platformChatData = getPlatformChartData(recordsResponse.data.content);
            const genderChatData = getGenderChartData(recordsResponse.data.content);
            setBarChartData(barData);
            setPlatformData(platformChatData);
            setGenderData(genderChatData);
        };
        getData();
     }, []);

    return (
        <div className="page-container">
            <Filters link="/records" linkText="VER TABELA" />
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">
                        Jogos mais votados
                  </h1>
                    <div className="games-container">
                        <Chart
                            options={barOptions}
                            type="bar"
                            width="900"
                            height="650"
                            series={[{ data: barChartData }]}
                        ></Chart>
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>
                        <Chart
                            options={{ ...pieOptions, labels: platformData?.labels }}
                            type="donut"
                            series={platformData?.series}
                            width="350"
                        />
                    </div>
                    <div className="gender-chart">
                        <h2 className="chart-title">Gêneros</h2>
                        <Chart
                            options={{ ...pieOptions, labels: genderData?.labels }}
                            type="donut"
                            series={genderData?.series}
                            width="350"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Charts;