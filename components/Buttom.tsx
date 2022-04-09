import { FC, MouseEventHandler } from 'react'
interface Props {
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}
const Button: FC<Props> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={
        'min-w-[100px] rounded-md bg-blue-500 py-2 px-1 text-white ' + className
      }
    >
      {children}
    </button>
  )
}

export default Button
