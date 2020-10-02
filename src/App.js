import React, { Component } from 'react';
import { defaults, Bar } from 'react-chartjs-2';
import { Card, Grid, Input, Button, Range, Switch, Message } from '@alifd/next';
import { Helmet } from "react-helmet";
import { fireWaveChange } from './Utils'
import Section from './Section'
import Clipboard from 'react-clipboard.js';
import { WaveCenter } from './DGLab' 
import './App.css';
defaults.global.animation = false;
const { Row, Col } = Grid;
class App extends Component {
  state = {
    labels: [],
    data: [],
    waveString: '',
    checkedSection1: false,
    checkedSection2: false,
    l: 5,
    zy: 10
  }
  get data() {
    return {
    labels: this.state.labels,
    datasets: [{
      label: '强度',
      categoryPercentage: 1,
      barPercentage: 1,
      backgroundColor: '#FFE99D',
      color: '#FFE99D',
      maxBarThickness: 2,
      data: this.state.data
    }]
};
  }
  options = { 
    maintainAspectRatio: false, 
    tooltips: { 
      enabled: false
    }, 
    legend: { 
      display: false 
    }, 
    title: { 
      display: true, 
      text: '波形', 
      fontColor: '#FFE99D'
    },
    scales: {
      xAxes: [{
          display: false
      }],
      yAxes: [{
          display: false,
          ticks: {
            min: 0,
            max: 20
          }
      }]
    }
  }
  onChangeSection1 = this.onChangeSection1.bind(this);
  onChangeSection2 = this.onChangeSection2.bind(this);
  updateWave = () => {
    clearTimeout(this.updatePlotTimer)
    let points1 = []
    let points2 = []
    let points3 = []
    Object.keys(window.wavegen.point1).forEach(k => {
      points1.push(new WaveCenter.BasicDataBean(k, window.wavegen.point1[k], 1))
    })
    Object.keys(window.wavegen.point2).forEach(k => {
      points2.push(new WaveCenter.BasicDataBean(k, window.wavegen.point2[k], 1))
    })
    Object.keys(window.wavegen.point3).forEach(k => {
      points3.push(new WaveCenter.BasicDataBean(k, window.wavegen.point3[k], 1))
    })
    this.waveCenter.selectWave(
      new WaveCenter.BasicWaveData(
        window.wavegen.a0,
        window.wavegen.a1,
        window.wavegen.a2,
        window.wavegen.b0,
        window.wavegen.b1,
        window.wavegen.b2,
        window.wavegen.c0,
        window.wavegen.c1,
        window.wavegen.c2,
        window.wavegen.j0,
        window.wavegen.j1,
        window.wavegen.j2,
        window.wavegen.pc0,
        window.wavegen.pc1,
        window.wavegen.pc2,
        window.wavegen.jie1,
        window.wavegen.jie2,
        window.wavegen.l,
        window.wavegen.zy,
        points1,
        points2,
        points3
      )
    )
    this.setState({
      waveString: this.waveCenter.toDGWaveGen()
    })
    this.updatePlotTimer = setInterval(this.updatePlot, 100)
  }
  showCopySuccess = () => Message.success('已复制');
  updatePlot = () => {
    try {
      this.waveCenter.waveTick()
      let plot = Array.from(this.waveCenter.getWavePlot())
      let plotData = this.state.data.concat(plot)
      if (plotData.length > 300) {
        plotData = plotData.slice(plotData.length - 300)
      }
      this.setState({
        data: plotData,
        labels: new Array(plotData.length).fill('')
      })
    } catch (error) { 
      this.waveCenter.resetWave()
    }
  }
  updatePlotTimer = null
  waveCenter = new WaveCenter()
  componentDidMount() {
    this.updateWave()
    window.addEventListener('wavechanged', this.updateWave)
    this.updatePlotTimer = setInterval(this.updatePlot, 100)
  }

  componentWillUnmount() {
    window.removeEventListener('wavechanged', this.updateWave)
    if (this.updatePlotTimer != null) clearInterval(this.updatePlotTimer)
  }

  onChangeSection1(checked) {
    if (checked) {
      window.wavegen['jie1'] = 1
    } else {
      window.wavegen['a1'] = 0
      window.wavegen['b1'] = 30
      window.wavegen['c1'] = 2
      window.wavegen['j1'] = 8
      window.wavegen['pc1'] = 1
      window.wavegen['jie1'] = 0
      window.wavegen['point1'] = {0: 20, 1: 20}
    }
    fireWaveChange()
    this.setState({
      checkedSection1: checked
    })
  }
  onChangeSection2(checked) {
    if (checked) {
      window.wavegen['jie2'] = 1
    } else {
      window.wavegen['a2'] = 0
      window.wavegen['b2'] = 30
      window.wavegen['c2'] = 2
      window.wavegen['j2'] = 8
      window.wavegen['pc2'] = 1
      window.wavegen['jie2'] = 0
      window.wavegen['point2'] = {0: 20, 1: 20}
    }
    fireWaveChange()
    this.setState({
      checkedSection2: checked
    })
  }
  onLValueChange(value) {
    this.setState({ l: value })
    window.wavegen['l'] = value
    fireWaveChange()
  }
  onZYValueChange(value) {
    this.setState({ zy: value })
    window.wavegen['zy'] = value
    fireWaveChange()
  }
  render() {
    let buttonCopy = (
      <Clipboard component={Button} onSuccess={this.showCopySuccess} button-href="#" className="odg-btn" data-clipboard-text={this.state.waveString}>
        复制
      </Clipboard>
    )
    let sectionA = (<Section section={0} />)
    let sectionB
    let sectionC
    if (this.state.checkedSection1) {
      sectionB = (<Section section={1} />)
    } else {
      sectionB = null
    }
    if (this.state.checkedSection2) {
      sectionC = (<Section section={2} />)
    } else {
      sectionC = null
    }
    return (
      <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>OpenDGLab WaveGen</title>
      </Helmet>
      <div role="grid">
      <Row>
        <Col span={24}>
          <h1 className="main-color" style={{ fontSize: '24px' }}><center>OpenDGLab 波形生成</center></h1>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Card free>
          <Card.Content>
            <Bar
              data={this.data}
              height="250px"
              width="100vh"
              options={this.options}
              redraw={true}
            />
          </Card.Content>
        </Card>
        </Col>
      </Row>
      <Row gutter={6} wrap>
        <Col xs={24} s={12} m={6}>
        <Card free>
          <Card.Header title="第一节"/>
          <Card.Content>
            {sectionA}
          </Card.Content>
        </Card>
        </Col>
        <Col xs={24} s={12} m={6}>
        <Card free>
          <Card.Header title="第二节" extra={(<Switch style={{width: '58px'}} size="small" onChange={this.onChangeSection1} checked={this.state.checkedSection1} defaultChecked={false} checkedChildren="启用" unCheckedChildren="关闭"></Switch>)} />
          <Card.Content>
            {sectionB}
          </Card.Content>
        </Card>
        </Col>
        <Col xs={24} s={12} m={6}>
        <Card free>
          <Card.Header title="第三节" extra={(<Switch style={{width: '58px'}} size="small" onChange={this.onChangeSection2} checked={this.state.checkedSection2} defaultChecked={false} checkedChildren="启用" unCheckedChildren="关闭"></Switch>)} />
          <Card.Content>
            {sectionC}
          </Card.Content>
        </Card>
        </Col>
        <Col xs={24} s={12} m={6}>
        <Card free>
          <Card.Header title="配置"/>
          <Card.Content>
            <p className="white-color">休息时长：</p>
            <Range defaultValue={this.state.l} style={{ width: '100%' }} step={0.001} hasTip={false} max={10} value={this.state.l} onChange={this.onLValueChange}/>
            <p className="white-color">高低频平衡</p>
            <Range defaultValue={this.state.zy} style={{ width: '100%' }} step={0.001} hasTip={false} max={20} value={this.state.zy} onChange={this.onZYValueChange}/>
          </Card.Content>
        </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Card free>
          <Card.Header title="导出"/>
          <Card.Content>
            <Input.Group addonAfter={buttonCopy}>
              <Input aria-label="导出" style={{ width: '100%' }} value={this.state.waveString} readOnly/>
            </Input.Group>
          </Card.Content>
        </Card>
        </Col>
      </Row>
      </div>
      </>
    );
  }
}

export default App;