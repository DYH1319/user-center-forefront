import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = 'DYH出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'User Center',
          title: '用户中心',
          href: 'https://user.dyh1319.asia',
          // 是否跳转到新页面打开
          blankTarget: true,
        },
        {
          key: 'Github',
          title: <GithubOutlined />,
          href: 'https://github.com/DYH1319',
          // 是否跳转到新页面打开
          blankTarget: true,
        },
        {
          key: 'MCSManager',
          title: 'MCSManager',
          href: 'http://mc.dyh1319.asia',
          // 是否跳转到新页面打开
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
