export const stylesForSelect = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#09090A" : "#121214",
        color: "#C98949",
        fontSize: "14px"
    }),
    control: (provided, state) => ({
        ...provided, 
        backgroundColor: "#121214",
        border: "none",
        borderRadius: "5px",
        boxShadow: "none"
    }),
    singleValue: (provided, state) => ({
        ...provided, 
        color:"#C98949",
        fontSize: "14px"
    }),
    menuList: (provided, state) => ({
        ...provided, 
        backgroundColor:  "#121214"
    }),
    placeholder: (provided, state) => ({
        ...provided, 
        fontSize: "14px"
    }),
    input: (provided, state) => ({
        ...provided,
        outline: "none !important"
    })
} 