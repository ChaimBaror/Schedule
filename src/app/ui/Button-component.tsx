

const Button = (Props: any) => {
    const { className, children, ...props } = Props;
    return (
        <button className={`${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button;