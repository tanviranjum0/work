import React from 'react'
import { Link, useParams, useHref } from 'react-router-dom'

const About = () => {
    const { name } = useParams()
    const location = window.location.pathname
    return (
        <div>
            <h1>About</h1>
            <p>Hello1, {location}!</p>
            <Link to="/">Go to Home</Link>
        </div>
    )
}

export default About
