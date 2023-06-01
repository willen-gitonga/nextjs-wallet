import {
  AiOutlinePieChart,
  AiOutlinePlusCircle,
  AiOutlineGift,
} from 'react-icons/ai'
import { BiTrendingUp } from 'react-icons/bi'
import { RiCoinsLine, RiNotification3Line } from 'react-icons/ri'
import { MdWeb } from 'react-icons/md'
import { BsPersonPlus } from 'react-icons/bs'

export const navItems = [
  {
    title: 'Assets',
    icon: <AiOutlinePieChart />,
  },
  {
    title: 'Dashboard',
    icon: <BiTrendingUp />,
  },
  {
    title: 'Load Wallet',
    icon: <RiCoinsLine />,
  },
  {
    title: 'Withdraw',
    icon: <MdWeb />,
  },
  {
    title: 'Send',
    icon: <AiOutlinePlusCircle />,
  },
  {
    title: 'Receive',
    icon: <RiNotification3Line />,
  },
 
]
