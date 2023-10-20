import Footer from '@/components/Footer';
import {login} from '@/services/ant-design-pro/api';
// import {getFakeCaptcha} from '@/services/ant-design-pro/login';
import {
  // AlipayCircleOutlined,
  LockOutlined,
  // MobileOutlined,
  // TaobaoCircleOutlined,
  UserOutlined,
  // WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  // ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {Alert, Divider, message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, Link} from 'umi';
import styles from './index.less';
import {STEAM_STORE, SYSTEM_LOGO} from "@/constants";
import {useModel} from "@@/plugin-model/useModel";
import {RuleObject, StoreValue} from "rc-field-form/lib/interface";

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const data = await login({
        ...values,
        type,
      });
      if (data) {
        // const defaultLoginSuccessMessage = '登录成功！';
        // message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        const {redirect} = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        // @ts-ignore
        setUserLoginState(data);
        return;
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };
  const {status, type: loginType} = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO}/>}
          title="Steam用户中心"
          subTitle={<a href={STEAM_STORE} target={"_blank"} rel="noreferrer">Steam用户中心是国区最具影响力的 <strong>Steam用户</strong> 平台</a>}
          initialValues={{
            // 是否默认勾选上自动登录
            autoLogin: true,
          }}
          // actions={[
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码登录'}/>
            {/*<Tabs.TabPane key="mobile" tab={'手机号登录'}/>*/}
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的账号和密码'}/>
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号必须不少于4位！'
                  },
                  {
                    max: 8,
                    type: 'string',
                    message: '账号必须不大于8位！'
                  },
                  {
                    pattern: new RegExp('^[A-Za-z0-9_-]+$'),
                    type: 'string',
                    message: '账号只能包含大小写字母、阿拉伯数字、下划线以及短横线！'
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 6,
                    type: 'string',
                    message: '密码必须不少于6位！'
                  },
                  {
                    max: 16,
                    type: 'string',
                    message: '密码必须不大于16位！'
                  },
                  {
                    pattern: new RegExp('^[A-Za-z0-9!@#$%^&*<>?_-]+$'),
                    type: 'string',
                    message: '密码只能包含大小写字母、阿拉伯数字以及下列符号:\n!@#$%^&*<>?_-'
                  },
                  ({}) => ({
                    validator(rule: RuleObject, value: StoreValue) {
                      if (value === undefined) {
                        return Promise.resolve()
                      }
                      let count = 0
                      count = new RegExp('[A-Z]').test(value) ? count + 1 : count
                      count = new RegExp('[a-z]').test(value) ? count + 1 : count
                      count = new RegExp('[0-9]').test(value) ? count + 1 : count
                      count = new RegExp('[!@#$%^&*<>?_-]').test(value) ? count + 1 : count
                      if (count < 2) {
                        return Promise.reject('密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！')
                      }
                      return Promise.resolve()
                    },
                    message: '密码需包含大写字母、小写字母、阿拉伯数字、特殊符号中的至少两项！'
                  }),
                ]}
              />
            </>
          )}

          {/*{status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误"/>}*/}
          {/*{type === 'mobile' && (*/}
          {/*  <>*/}
          {/*    <ProFormText*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <MobileOutlined className={styles.prefixIcon}/>,*/}
          {/*      }}*/}
          {/*      name="mobile"*/}
          {/*      placeholder={'请输入手机号！'}*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: '手机号是必填项！',*/}
          {/*        },*/}
          {/*        {*/}
          {/*          pattern: /^1\d{10}$/,*/}
          {/*          message: '不合法的手机号！',*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*    <ProFormCaptcha*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <LockOutlined className={styles.prefixIcon}/>,*/}
          {/*      }}*/}
          {/*      captchaProps={{*/}
          {/*        size: 'large',*/}
          {/*      }}*/}
          {/*      placeholder={'请输入验证码！'}*/}
          {/*      captchaTextRender={(timing, count) => {*/}
          {/*        if (timing) {*/}
          {/*          return `${count} ${'秒后重新获取'}`;*/}
          {/*        }*/}
          {/*        return '获取验证码';*/}
          {/*      }}*/}
          {/*      name="captcha"*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: '验证码是必填项！',*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*      onGetCaptcha={async (phone) => {*/}
          {/*        const result = await getFakeCaptcha({*/}
          {/*          phone,*/}
          {/*        });*/}
          {/*        // @ts-ignore*/}
          {/*        if (result === false) {*/}
          {/*          return;*/}
          {/*        }*/}
          {/*        message.success('获取验证码成功！验证码为：1234');*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*)}*/}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <Divider type={"vertical"}/>
            <a
              href={STEAM_STORE}
              target={"_blank"} rel="noreferrer"
            >
              忘记密码?那就忘了吧
            </a>
            <Divider type={"vertical"}/>
            <Link
              style={{
                float: 'right',
              }}
              to={"/user/register"}
            >
              注册新用户
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
