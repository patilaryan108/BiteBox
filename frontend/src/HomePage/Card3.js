import React from 'react'

function Card3() {
    const cardStyle = {
        width: "300px",
        height: "300px",
        margin: '3px',
        backgroundColor: "#f082eeff", // Soft pink from reference image
        borderRadius: "15px", // Rounded corners
        overflow: "hidden", // Ensure content doesn't spill out
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Subtle shadow
        border: "none" // Remove default border
    };

    const cardBodyStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%", // Fill the card height
        textAlign: "center",
        padding: "1rem", // Reduced padding
        color: "#2c1e1e" // Dark text color
    };

    const textStyle = {
        fontSize: "1.1rem", // Reduced font size to fit text
        fontWeight: "900", // Extra bold
        textTransform: "uppercase", // All caps
        lineHeight: "1.2",
        fontFamily: " sans-serif" // Condensed bold font look
    };

    const authorStyle = {
        textTransform: "uppercase",
        marginTop: "10px"
    };

    const hrStyle = {
        width: "60%",
        borderTop: "2px solid rgba(0,0,0,0.2)",
        margin: "0.5rem 0" // Reduced margin
    };

    return (
        <>
            <div className='col' style={{ marginTop: '30px', flex: '0 0 0', marginRight: '10px' }}>
                <div className='card' style={cardStyle}>
                    <div className='card-body' style={cardBodyStyle}>
                        <p className='card-text' style={textStyle}>"I NEVER KNEW I<br /> COULD EAT HEALTHY MEALS<br></br> UNTIL I FOUND BITEBOX."</p>
                        <hr style={hrStyle} />
                        <h4 style={authorStyle}>- POLINA MORROW</h4>
                    </div>
                </div>
            </div>
            <div className='col' style={{ flex: '0 0 0', marginRight: '10px' }}>
                <div className='card' style={{ ...cardStyle, backgroundColor: "#edf19bff" }}>
                    <div className='card-body' style={cardBodyStyle}>
                        <h5 className='card-text' style={textStyle}>"IT'S BEEN AN <br></br>ENLIGHTENING JOURNEY <br></br>WITH BITEBOX"</h5>
                        <hr style={hrStyle} />
                        <h4 style={authorStyle}>- CUSTOMER 2</h4>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Card3;