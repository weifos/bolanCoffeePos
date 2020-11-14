/// <summary>
/// 全局配置类
/// @author   叶委  
/// @date     2014-05-23         
/// </summary>
export default {
    config: {
        domain: function () {
            var dms = window.location.host.split(".")
            if (window.location.host.indexOf('com.cn') != -1) {
                return document.domain.split('.').slice(-3).join('.')
            }
            return document.domain.split('.').slice(-2).join('.')
        }
    },
    verifyStr: {
        // 没有验证  
        normal: function () {
            return true;
        },
        // 匹配任意字符
        anyCharacter: function (str) {
            return $.trim(str).length >= 1;
        },
        // 编号验证
        isNo: function (serialNumber) {
            return /^[a-zA-Z0-9_-]{1,100}$/.test(serialNumber);
        },
        // 英文名称验证
        isEnglishName: function (englishName) {
            return /^[a-zA-Z_-]{1,100}$/.test(englishName);
        },
        // 货币英文简写验证
        isEnglishAbbreviation: function (abbreviation) {
            return /^[A-Z]{3}$/.test(abbreviation);
        },
        // 价格格式验证，验证小数点后2位
        isPrice: function (price) {
            return /(^[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/.test(price);
        },
        // 价格格式验证，验证小数点后2位
        isLGZeroPrice: function (price) {
            return /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/.test(price) && price > 0;
        },
        // 金额格式验证，小数点后位不做验证
        isAmount: function (amount) {
            return /^-?\d+\.{0,}\d{0,}$/.test(amount);
        },
        /// 金额格式 验证大于等于0，验证小数点后2位
        isShipments: function (amount) {
            // return /^\d+\.{0,}\d{0,}$/.test(amount);
            return /^\d+\.*(\.\d{1,2})?$/.test(amount);
        },
        /// 金额格式验证，小数点后位不做验证
        isProfitRatio: function (amount) {
            let profit = /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/.test(amount);
            //数字
            if (profit) {
                if (amount < 0) {
                    return false;
                }
                if (amount.indexOf('.') > -1) {
                    if (amount.substring(0, amount.indexOf('.')).length > 2) {
                        return false;
                    }
                    if (amount.length > 5) {
                        return false;
                    }
                }
                else {
                    if (amount.length > 2) {
                        if (amount == 100) {

                        }
                        else {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        },
        /// 大于0金额格式验证 
        isLGZeroAmount: function (amount) {
            return /^-?\d+\.{0,}\d{0,}$/.test(amount) && amount > 0;
        },
        /// 邮箱格式验证
        isEmail: function (email) {
            return /^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/i.test(email);
        },
        /// QQ号码格式验证
        isQQNumber: function (qq) {
            return /^[1-9]\d{4,10}$/.test(qq);
        },
        /// 登录名格式验证
        isLoginName: function (loginName) {
            return /^[a-zA-Z0-9_-]{6,16}$/.test(loginName);
        },
        /// 密码格式验证 验证用户密码(正确格式为：长度在6~16 之间，任意字符)  
        isPsw: function (psw) {
            return /^[a-zA-Z0-9_-]{6,16}$/.test(psw);
        },
        /// 手机号码格式验证  
        isMoblie: function (mobile) {
            return /^1[345678]\d{9}$/.test(mobile);
        },
        /// 电话号码格式验证  
        isPhone: function (phone) {
            return /(^[0-9]{3,4}[\-|\s][0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[345678]\d{9}$)/.test(phone);
        },
        /// 邮编格式验证  
        isPostCode: function (postCode) {
            return /^[0-9]{6}$/.test(postCode);
        },
        /// 验证码基本格式验证  
        code4: function (validateCode) {
            return /^[a-zA-Z0-9]{4,4}$/.test(validateCode);
        },
        /// 验证码基本格式验证  
        code5: function (validateCode) {
            return /^[a-zA-Z0-9]{5,5}$/.test(validateCode);
        },
        // 验证汉字数字字母 
        isNumberlatterCcter: function (userName) {
            return /^[\u0391-\uFFE5A-Za-z0-9]+$/.test(userName);
        },
        // 验证汉字逗号 
        isHanZiDouHao: function (economyCity) {
            return /^[\u4e00-\u9fff,]+$/.test(economyCity);
        },
        // 日期格式验证 
        isDate: function (date) {
            return /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/.test(date);
        },
        /// 网络地址验证 
        isUrl: function (url) {
            return /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i.test(url);
        },
        /// IP地址 
        isIpAddress: function (ip) {
            return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/i.test(ip);
        },
        /// 正整数格式验证 ~
        isNumber: function (number) {
            return /^\d+$/g.test(number);
        },
        /// 浮点数格式验证 
        isFloat: function (number) {
            return /^\d+(\.\d+)?$/.test(number);
        },
        /// 大于0的正整数格式验证 
        isLGZeroNumber: function (number) {
            return /^([1-9]\d{0,15})$/g.test(number);
        },
        // 是否是身份证号码  
        isIdCard: function (idCard) {
            idCard = $.trim(idCard);
            if (idCard.length == 15) {
                return this.isValidityBrithBy15IdCard(idCard);
            } else if (idCard.length == 18) {
                let a_idCard = idCard.split("");// 得到身份证数组   
                if (this.isValidityBrithBy18IdCard(idCard) && this.isTrueValidateCodeBy18IdCard(a_idCard)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        // 验证15位数身份证号码中的生日是否是有效生日   
        isValidityBrithBy15IdCard: function (idCard) {
            let year = idCard15.substring(6, 8);
            let month = idCard15.substring(8, 10);
            let day = idCard15.substring(10, 12);
            let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
            if (temp_date.getYear() != parseFloat(year)
                || temp_date.getMonth() != parseFloat(month) - 1
                || temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        },
        // 验证18位数身份证号码中的生日是否是有效生日   
        isValidityBrithBy18IdCard: function (idCard18) {
            let year = idCard18.substring(6, 10);
            let month = idCard18.substring(10, 12);
            let day = idCard18.substring(12, 14);
            let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题   
            if (temp_date.getFullYear() != parseFloat(year)
                || temp_date.getMonth() != parseFloat(month) - 1
                || temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        },
        // 判断身份证号码为18位时最后的验证位是否正确   
        isTrueValidateCodeBy18IdCard: function (a_idCard) {
            let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
            // 身份证验证位值.10代表X
            let ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
            // 声明加权求和变量   
            let sum = 0;
            if (a_idCard[17].toLowerCase() == 'x') {
                a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
            }
            for (let i = 0; i < 17; i++) {
                sum += Wi[i] * a_idCard[i];// 加权求和   
            }
            let valCodePosition = sum % 11;// 得到验证码所位置   
            if (a_idCard[17] == ValideCode[valCodePosition]) {
                return true;
            } else {
                return false;
            }
        },
        // 银行卡号验证 
        isBankCardNo: function (bankno) {
            if ($.trim(bankno).length == 0) return false;
            let lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

            let first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
            let newArr = new Array();
            for (let i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
                newArr.push(first15Num.substr(i, 1));
            }
            let arrJiShu = new Array();  //奇数位*2的积 <9
            let arrJiShu2 = new Array(); //奇数位*2的积 >9

            let arrOuShu = new Array();  //偶数位数组
            for (let j = 0; j < newArr.length; j++) {
                if ((j + 1) % 2 == 1) {//奇数位
                    if (parseInt(newArr[j]) * 2 < 9)
                        arrJiShu.push(parseInt(newArr[j]) * 2);
                    else
                        arrJiShu2.push(parseInt(newArr[j]) * 2);
                }
                else //偶数位
                    arrOuShu.push(newArr[j]);
            }

            let jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
            let jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
            for (let h = 0; h < arrJiShu2.length; h++) {
                jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
            }

            let sumJiShu = 0; //奇数位*2 < 9 的数组之和
            let sumOuShu = 0; //偶数位数组之和
            let sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
            let sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
            let sumTotal = 0;
            for (let m = 0; m < arrJiShu.length; m++) {
                sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
            }

            for (let n = 0; n < arrOuShu.length; n++) {
                sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
            }

            for (let p = 0; p < jishu_child1.length; p++) {
                sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
            }
            //计算总和
            sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

            //计算Luhm值
            let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
            let luhm = 10 - k;

            if (lastNum == luhm) {
                //$("#banknoInfo").html("Luhm验证通过");
                return true;
            }
            else {
                //$("#banknoInfo").html("银行卡号必须符合Luhm校验");
                return false;
            }
        },
        // 验证营业执照是否合法 
        isBusinessLicense: function (busCode) {
            let ret = false;
            if (busCode.length == 15) {
                let sum = 0;
                let s = [], p = [], a = [], m = 10;
                p[0] = m;
                for (let i = 0; i < busCode.length; i++) {
                    a[i] = parseInt(busCode.substring(i, i + 1), m);
                    s[i] = (p[i] % (m + 1)) + a[i];
                    if (0 == s[i] % m) {
                        p[i + 1] = 10 * 2;
                    } else {
                        p[i + 1] = (s[i] % m) * 2;
                    }
                }
                if (1 == (s[14] % m)) {
                    ret = true;
                } else {
                    ret = false;
                }
            } else {
                ret = false;
            }
            return ret;
        },
        /// 验证营业执照是否合法 三证合一
        isBizLicense: function (busCode) {
            this.firstarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            this.firstkeys = [3, 7, 9, 10, 5, 8, 4, 2];
            this.secondarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'];
            this.secondkeys = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
            this.calc = function (code, array1, array2, b) {
                let count = 0;
                for (let i = 0; i < array2.length; i++) {
                    let a = code[i];
                    count += array2[i] * array1.indexOf(a);
                }
                return b - count % b;
            }

            let code = busCode.toUpperCase();

            if (code.length != 18) { return false; }
            let reg = /^\w\w\d{6}\w{9}\w$/;
            if (!reg.test(code)) {
                return false;
            }

            reg = /^[1,5,9,Y]\w\d{6}\w{9}\w$/;
            if (!reg.test(code)) {
                return false;
            }

            reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
            if (!reg.test(code)) {
                return false;
            }
            reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
            if (!reg.test(code)) {
                return false;
            }
            let firstkey = this.calc(code.substr(8),
                this.firstarray,
                this.firstkeys,
                11);

            let firstword;
            if (firstkey < 10) {
                firstword = firstkey;
            } if (firstkey == 10) {
                firstword = 'X';
            } else if (firstkey == 11) {
                firstword = '0';
            }
            if (firstword != code.substr(16, 1)) {
                return false;
            }

            let secondkey = this.calc(code,
                this.secondarray,
                this.secondkeys,
                31);

            let secondword = this.secondarray[secondkey];
            if (secondword == undefined || secondword != code.substr(17, 1)) {
                return false;
            }
            let word = code.substr(0, 16) + firstword + secondword;
            if (code != word) {
                // return false;
            }
            return true;
        },
    },
    state: {
        // 系统错误
        state_500: 500,
        // 响应成功 
        state_200: 200,
        // 验证通过 
        state_0: 0,
        // 验证未通过
        state_1: 1,
        // 用户未登陆
        state_30045: 30045
    },
    util: {
        //日期对象
        date: {
            //获取当前日期
            getDate: function (days) {
                let d = new Date();
                if (days != undefined) {
                    let milliseconds = days * 24 * 60 * 60 * 1000;
                    let timestamp = Date.parse(d);
                    return new Date(timestamp + milliseconds);
                }
                return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            },
            //获取当前时间
            getDateTimeNow: function (days) {
                let d = new Date();
                if (days != undefined) {
                    d.setDate(d.getDate() + days);
                }
                return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            },
            //日期格式化
            DateFormat: function (date, format) {
                var d = new Date(date.replace(/-/g, '/'));
                let o = {
                    "M+": d.getMonth() + 1,
                    "d+": d.getDate(),
                    "h+": d.getHours(),
                    "m+": d.getMinutes(),
                    "s+": d.getSeconds(),
                    "q+": Math.floor((d.getMonth() + 3) / 3),
                    "S": d.getMilliseconds()
                }
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (let k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },
            //json格式日期处理
            ChangeDateFormat: function (time) {
                if (time != null) {
                    if (time.indexOf('T') != -1) {
                        return time.substr(0, time.indexOf('T'));
                    }
                    let date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    return date.getFullYear() + "-" + month + "-" + currentDate;
                }
                return "";
            },
            //json格式日期处理（时分秒）
            ChangeCompleteDateFormat: function (time) {
                if (time != null) {
                    if (time.indexOf('T') != -1) {
                        if (time.indexOf('.') != -1) {
                            time = time.substr(0, time.indexOf('.'));
                        }
                        return time.replace('T', ' ');
                    }
                    let date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                }
                return "";
            },
            //json格式日期处理（时分秒）
            ChangeComDateFormat: function (time) {
                if (time != null) {
                    if (time.indexOf('T') != -1) {
                        if (time.indexOf('.') != -1) {
                            time = time.substr(0, time.indexOf('.'));
                        }
                        return time.replace('T', ' ');
                    }
                    let date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes()
                }
                return "";
            },//时间比较
            CompareDate: function (t1, t2) {
                t1 = new Date(this.ChangeDateFormat(t1));
                t2 = new Date(this.ChangeDateFormat(t2));
                return t1 > t2;
            },
            //时间比较
            CompareDateNow: function (t1) {
                return new Date(t1.replace(new RegExp(/-/gm), "/")) > new Date(this.getDateTimeNow().replace(new RegExp(/-/gm), "/"))
            }
        },
        //生成流水号
        getSerialNum: function (prefix, len) {
            let now = new Date()
            let year = now.getFullYear().toString().substr(2, 2)
            let month = now.getMonth() + 1
            let day = now.getDate()
            let hour = now.getHours()
            let minutes = now.getMinutes()
            let seconds = now.getSeconds()
            let milliSeconds = now.getMilliseconds()
            month = String(month).length < 2 ? ("0" + month.toString()) : month
            day = String(day).length < 2 ? ("0" + day.toString()) : day
            hour = String(hour).length < 2 ? ("0" + hour.toString()) : hour
            minutes = String(minutes).length < 2 ? ("0" + minutes.toString()) : minutes
            seconds = String(seconds).length < 2 ? ("0" + seconds.toString()) : seconds
            if (String(milliSeconds).length == 1) {
                milliSeconds = "00" + milliSeconds.toString()
            } else if (String(milliSeconds).length == 2) {
                milliSeconds = "0" + milliSeconds.toString()
            }

            let str_random = ''
            if (len > 15) {
                let chars = '0123456789'
                let maxPos = chars.length
                for (let i = 0; i < len - 15; i++) {
                    str_random += chars.charAt(Math.floor(Math.random() * maxPos))
                }
            }

            let str = `${year}${month}${day}${hour}${minutes}${seconds}${milliSeconds}` + str_random
            if (prefix != undefined && prefix != null) {
                return prefix + str
            }
            return str
        },
        //获取最小值到最大值之前的整数随机数
        getRandom: function (Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        },
        //比对sku字符串
        compareSku: function (sku1, sku2) {
            let exist = 0
            let arr = sku1.split(',')
            let arr1 = sku2.split(',')
            //sku集合是否一致
            if (arr.length != arr1.length) {
                return false
            }

            arr.forEach(function (o, i) {
                arr1.forEach(function (oo, ii) {
                    if (oo == o) {
                        exist++
                    }
                })
            })
            return arr.length == exist
        },
        //获取SKU信息
        getCustomName: function (specCustoms, name_id, val_id, val) {
            var custom_name = val
            specCustoms.forEach(function (item, index) {
                if (
                    name_id == item.specname_id &&
                    val_id == item.specvalue_id &&
                    item.custom_value != ''
                ) {
                    custom_name = item.custom_value
                    return
                }
            })
            return custom_name
        },
        //本地文件转成base64
        fileToBase64: function () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    // 图片转base64完成后返回reader对象
                    resolve(reader)
                }
                reader.onerror = reject
            })
        },
        //隐藏手机
        getHideMobile: function (tel) {
            if (tel == null || tel == undefined) return
            var reg = /^(\d{3})\d{4}(\d{4})$/;
            return tel.replace(reg, "$1****$2");
        },
        //保留小数，不四舍五入
        formatDecimal: function (num, n) {
            num = num.toString()
            let index = num.indexOf('.')
            if (index !== -1) {
                num = num.substring(0, n + index + 1)
            } else {
                num = num.substring(0)
            }
            return parseFloat(num).toFixed(n)
        },
        //字符串截取
        cutSubString: function (str, len) {
            if (!str || !len) { return ''; }
            let l = 0;
            let temp = '';
            for (let i = 0, m = str.length; i < m; i++) {
                l++;
                if (str.charCodeAt(i) > 255) { l++; }
                if (l > len) { return temp + '...'; }
                temp += str.charAt(i);
            }
            return str;
        },
        //金额格式
        formaToMoney: function (s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            f = s < 0 ? "-" : ""; //判断是否为负数  
            s = parseFloat((Math.abs(s) + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//取绝对值处理, 更改这里n数也可确定要保留的小数位  
            let l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return f + t.split("").reverse().join("") + "." + r.substring(0, 2);//保留2位小数  如果要改动 把substring 最后一位数改动就可  
        },
        //获取原图地址
        getImgUrl: function (url) {
            if (undefined == url || $.trim(url).length == 0) return App_Config.getResDomain() + "/Content/Resources/Web/DefaultRes/Image/NoProduct.jpg";
            if (url.indexOf("http://") != -1) {
                return url;
            } else {
                return App_Config.getResDomain() + url;
            }
        },
        //获取小图地址
        getImgUrl_s: function (url) {
            if (undefined == url || $.trim(url).length == 0) return App_Config.getResDomain() + "/Content/Resources/Web/DefaultRes/Image/NoProduct.jpg";
            if (url.indexOf("http://") != -1) {
                return url.replace("/Image/", /Thm_Image/);
            } else {
                return App_Config.getResDomain() + url.replace("/Image/", /Thm_Image/);
            }
        },
        //获取中图地址
        getImgUrl_m: function (url) {
            if (undefined == url || $.trim(url).length == 0) return App_Config.getResDomain() + "/Content/Resources/Web/DefaultRes/Image/NoProduct.jpg";
            if (url.indexOf("http://") != -1) {
                return url.replace("/Image/", /Med_Image/);
            } else {
                return App_Config.getResDomain() + url.replace("/Image/", /Med_Image/);
            }
        },
        //获取Oss图片地址
        getOssImgUrl: function (filename, param) {
            if (undefined == filename || filename == null || $.trim(filename).length == 0) {
                return App_Config.getResDomain() + "/Content/DefaultRes/Image/NoProduct.jpg";
            }
            if (undefined == param || param == null || $.trim(param).length == 0) {
                if (filename.indexOf("http://") != -1) {
                    return filename;
                }
                return App_Config.getOssDomain() + filename;
            }
            if (filename.indexOf("http://") != -1) {
                return filename + param;
            } else {
                return App_Config.getOssDomain() + filename + param;
            }
        },
        //获取页面请求参数
        getUrlParam: function (name) {
            let search = window.location.search;
            let hash = window.location.hash;
            if (search.length) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                let r = search.substr(1).match(reg);
                if (r != null) return unescape(decodeURI(r[2])); return null;
            } else if (hash.length) {
                let reg = new RegExp(name + '=([^&]+)')
                let match = reg.exec(hash)
                if (match) { return match[1] }
                return match
            }
            return null;
        },
        //获取页面请求参数中的ID
        getRequestId: function (name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(decodeURI(r[2])); return 0;
        },
        //获取Html前缀参数
        getHtmlId: function () {
            let url = window.location.href;
            let s_index = url.lastIndexOf('/');
            let e_index = url.lastIndexOf('.html');
            return url.substring(s_index + 1, e_index);
        },
        //获取网站域名
        getDomain: function () {
            return window.location.protocol + '//' + window.location.host;
        },
        //获取原始URL
        getRawUrl: function () {
            return window.document.location.href;
        },
        //判断是否是数组
        isArray: function (object) {
            return (typeof object == 'object') && object.constructor == Array;
        },
        //判断是否为函数
        isFunction: function (object) {
            return (typeof object == 'function') && object.constructor == Function;
        },
        //判断是否为字符串类型
        isString: function (object) {
            return (object != null) && (object != undefined) && (typeof object == 'string') && (object.constructor == String);
        },
        //判断是否是对象
        isJQuery: function (object) {
            return (object instanceof jQuery);
        },
        //判断是否是对象
        isObject: function (object) {
            return (typeof object == 'object') && object.constructor == Object;
        },
        //判断是否为数值类型
        isNum: function (object) {
            return !isNaN(object);
        },
        parseInt: function (value) {
            return Number(value);
        },
        //是否是微信浏览器
        isWeixinBrowser: function () {
            let agent = navigator.userAgent.toLowerCase();
            if (agent.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        //是否是Ios环境
        isIos: function () {
            let agent = navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(agent);
        }
    },
    //设置POS信息
    setPos: function (result) {
        window.localStorage.setItem("pos", JSON.stringify(result))
    },
    //获取POS信息
    getPos: function () {
        let posInfo = window.localStorage.getItem("pos")
        if (posInfo) {
            return JSON.parse(posInfo)
        }
        return null
    },
    //设置本地购物车
    setShoppingCart: function (result) {
        let that = this
        let exist = false
        let shopping_cart = that.getShoppingCart()
        shopping_cart.forEach((ele, index) => {
            //是否存在对应的商品
            if (that.util.compareSku(result.specset, ele.specset) && ele.sto_product_id == result.sto_product_id) {
                if (result.count > 0) {
                    ele.count = ele.count + result.count
                } else {
                    ele.count = ele.count - 1
                }
                exist = true
                return
            }
        })

        if (!exist) {
            let tmp = {
                sto_sku_id: result.id,
                specset: result.specset,
                spec_msg: result.sku_name,
                product_id: result.product_id,
                sto_product_id: result.sto_product_id,
                product_no: result.product_no,
                product_name: result.product_name,
                count: result.count,
                unit_price: result.sale_price
            }
            shopping_cart.push(tmp)
        }

        window.localStorage.setItem("shopping_cart", JSON.stringify(shopping_cart))
    },
    //获本地购物车
    getShoppingCart: function () {
        let result = window.localStorage.getItem("shopping_cart")
        if (result) {
            return JSON.parse(result)
        }
        return []
    },
    //删除本地购物车
    delShoppingCart: function (index) {
        let shopping_cart = this.getShoppingCart()
        shopping_cart.splice(index, 1)
        window.localStorage.setItem("shopping_cart", JSON.stringify(shopping_cart))
    },
    //清空本地购物车
    clearShoppingCart: function () {
        localStorage.removeItem('shopping_cart')
    }
}