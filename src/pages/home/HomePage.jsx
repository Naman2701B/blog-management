import React from "react";
import MainLayout from "../../components/MainLayout";
import Hero from "../container/Hero";
import Article from "../container/Articles";
const HomePage = () => {
    return (
        <MainLayout>
            <Hero />
            <Article />
        </MainLayout>
    );
};

export default HomePage;
