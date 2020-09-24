import React, { Component } from 'react';
import { Button, Range, Select, Icon } from '@alifd/next';
import BasicDataRange from './BasicDataRange'
import { fireWaveChange } from './Utils'
import './App.css';
class Section extends Component {
    state = {
        pc: 1,
        pcvalue: 30,
        j: 8,
        c: 2
    };
    onChangePCSlider = this.onChangePCSlider.bind(this);
    onChangePCSlider(value) {
        if (value === 1) {
            if ((typeof this.state.pcvalue) === 'number') {
                window.wavegen['pc' + this.props.section] = value
                window.wavegen['a' + this.props.section] = 0
                window.wavegen['pc' + this.props.section] = this.state.pcvalue
                this.setState({pc: value})
            } else {
                window.wavegen['pc' + this.props.section] = value
                window.wavegen['a' + this.props.section] = 0
                window.wavegen['pc' + this.props.section] = this.state.pcvalue[1]
                this.setState({pc: value, pcvalue: this.state.pcvalue[1]})
            }
        } else {
            if ((typeof this.state.pcvalue) === 'object') {
                window.wavegen['pc' + this.props.section] = value
                window.wavegen['a' + this.props.section] = this.state.pcvalue[0]
                window.wavegen['pc' + this.props.section] = this.state.pcvalue[1]
                this.setState({pc: value})
            } else {
                window.wavegen['pc' + this.props.section] = value
                window.wavegen['a' + this.props.section] = 0
                window.wavegen['pc' + this.props.section] = this.state.pcvalue
                this.setState({pc: value, pcvalue: [0, this.state.pcvalue]})
            }
        }
        fireWaveChange()
    };
    onPCValueChange = this.onPCValueChange.bind(this);
    onPCValueChange(value) {
        this.setState({pcvalue: value})
        if ((typeof value) === 'number') {
            window.wavegen['a' + this.props.section] = 0
            window.wavegen['b' + this.props.section] = value
        } else {
            window.wavegen['a' + this.props.section] = value[0]
            window.wavegen['b' + this.props.section] = value[1]
        }
        fireWaveChange()
    };
    onJValueChange = this.onJValueChange.bind(this);
    onJValueChange(value) {
        this.setState({j: value})
        window.wavegen['j' + this.props.section] = value
        fireWaveChange()
    }
    onAddPulseTime = this.onAddPulseTime.bind(this);
    onAddPulseTime() {
        if (this.state.c < 20) {
            window.wavegen['c' + this.props.section] = this.state.c + 1
            window.wavegen['point' + (this.props.section + 1)][this.state.c] = 20
            this.setState({c: this.state.c + 1})
            fireWaveChange()
        }
    }
    onMinusPulseTime = this.onMinusPulseTime.bind(this);
    onMinusPulseTime() {
        if (this.state.c > 2) {
            console.log(this.state.c)
            window.wavegen['c' + this.props.section] = this.state.c - 1
            delete window.wavegen['point' + (this.props.section + 1)][this.state.c - 1]
            this.setState({c: this.state.c - 1})
            fireWaveChange()
        }
    }
    render() {
        let pcslider
        if (this.state.pc === 1) {
            pcslider = 'single'
        } else {
            pcslider = 'double'
        }
        let pulse = Array.from({length: this.state.c}, (x, i) => i).map(v => {
            return (<BasicDataRange jie={this.props.section} indexed={v}/>)
        })
        let jreal = Math.ceil(Math.pow(((this.state.j + 1) / 101.0), 1.6) * 100.0) / 10.0
        let jcreal = Math.ceil(jreal/(this.state.c/10.0)) * (this.state.c/10.0)
        jcreal = Math.round((jcreal + Number.EPSILON) * 100) / 100
        return (
        <>
      <p className="white-color">脉冲频率：
        <span>
          <Select defaultValue={1} value={this.state.pc} onChange={this.onChangePCSlider}>
            <Select.Option value={1}>固定</Select.Option>
            <Select.Option value={2}>节间渐变</Select.Option>
            <Select.Option value={3}>元内渐变</Select.Option>
            <Select.Option value={4}>节内渐变</Select.Option>
            <Select.Option value={5}>阶梯渐变</Select.Option>
            <Select.Option value={6}>每节随机</Select.Option>
            <Select.Option value={7}>每元随机</Select.Option>
          </Select>
        </span>
      </p>
      <Range defaultValue={30} min={0} max={100} value={this.state.pcvalue} style={{ width: '100%' }} slider={pcslider} hasTip={false} onChange={this.onPCValueChange}/>
      <p className="white-color">脉冲形状：{this.state.c / 10.0}S 
      <p>
      <Button.Group>
        <Button className="odg-btn" onClick={this.onMinusPulseTime}><Icon type="minus" /></Button>
        <Button className="odg-btn" onClick={this.onAddPulseTime}><Icon type="add" /></Button>
      </Button.Group>
      </p>
      </p>
      <p>
        {pulse}
      </p>
        <p className="white-color">小节时长：{jreal}S ({jcreal}S)</p>
      <Range defaultValue={30} min={0} max={100} style={{ width: '100%' }} hasTip={false} onChange={this.onJValueChange} value={this.state.j} />
      </>
        )
    }
}
export default Section