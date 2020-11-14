/// <summary>
/// 程序脚本中间件
/// @author   叶委  
/// @date     2019-10-23         
/// </summary>
import app_g from '@/modules/appGlobal'

export default {
    devInfo: '{ "Basis": { "State": 200, "Sign": "", "Msg": "操作成功" }, "Result": { "network_card": "00:1C:42:6F:BF:86","product":"browser","store_id":1 } }',
    //POS设备初始化
    init(callback) {
        try {
            if (app_middleware != undefined) {
                app_middleware.getDeviceInfo(callback)
            }
        } catch (ex) {
            callback(this.devInfo)
        }
    },
    //调用打印
    print(store_id, sys_user_id, order_no, type, callback) {
        try {
            if (app_middleware != undefined) {
                //当前设备pos机号
                let pos_no = app_g.getPos().no
                app_middleware.print(store_id, sys_user_id, pos_no, order_no, type, callback)
            }
        } catch (ex) {
            callback(this.devInfo)
        }
    },
    //播放声音
    playNty(callback) {
        try {
            if (app_middleware != undefined) {
                app_middleware.playNty(callback)
            }
        } catch (ex) {
            callback(this.devInfo)
        }
    }
}

