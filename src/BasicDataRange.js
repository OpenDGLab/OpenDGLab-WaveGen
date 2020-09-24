import React, { Component } from 'react';
import { Range } from '@alifd/next';
import { fireWaveChange } from './Utils'
import './App.css';
class BasicDataRange extends Component {
    state = {
        value: 20
    }
    onChange = this.onChange.bind(this)
    onChange(value) {
        this.setState({value})
        window.wavegen['point' + (this.props.jie + 1)][this.props.indexed] = value
        fireWaveChange()
    }
    render() {
        return (<Range defaultValue={20} value={this.state.value} onChange={this.onChange} min={0} max={20} step={0.0001} style={{ width: '100%', marginBottom: '8px' }} hasTip={false} />)
    }
}

export default BasicDataRange