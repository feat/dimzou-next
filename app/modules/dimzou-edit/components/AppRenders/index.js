import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { 
  TemplateI,
  TemplateII,
  TemplateIII,
  TemplateIV,
  TemplateV,
} from '../Template';
import CoverTemplate from '../CoverTemplate';
import SidebarName from '../SidebarName'

const renderProps = {
  id: PropTypes.string, // main content header,
  title: PropTypes.node,
  summary: PropTypes.node,
  content: PropTypes.node,
  cover: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
}

const delta = 15;


function setSidebarFirst(dom, wrapper, offsetTop = 0) {
  if (!dom || !wrapper) {
    return;
  }
  
  const header = document.getElementById('header');
  const offset = header ? header.clientHeight : 0;
  const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
  const wrapperBox = wrapper.getBoundingClientRect();
  const height =  Math.min(wrapperBox.bottom, viewportHeight) - offset - offsetTop - delta;
  // eslint-disable-next-line
  dom.style.height = `${height}px`;
}


function setStickyOffset(doms) {
  const header = document.getElementById('header');
  const offset = header ? header.clientHeight : 0;
  doms.forEach((dom) => {
    if (dom) {
      // eslint-disable-next-line
      dom.style.top = `${offset}px`;
    }
  })
}

function useDimzouLayout(deps) {
  const containerRef = useRef(null);
  const wrapRef = useRef(null);
  const labelRef = useRef(null);
  const sidebarFirstRef = useRef(null);
  const sidebarSecondRef = useRef(null);

  // set sticky
  useEffect(() => {
    const updateSitckyOffset = () => {
      setStickyOffset([
        sidebarFirstRef.current,
        sidebarSecondRef.current,
      ])
    }
    updateSitckyOffset();
    window.addEventListener('resize', updateSitckyOffset)
    return () => {
      window.addEventListener('resize', updateSitckyOffset)
    }
  }, deps)

  // handle sidebarFirst height;
  useEffect(() => {
    const updateSidebarHeight = () => {
      let offsetTop;
      if (labelRef.current) {
        const marginBottom = window.getComputedStyle(labelRef.current).marginBottom;
        offsetTop = labelRef.current.clientHeight + parseInt(marginBottom, 10);
      }
      setSidebarFirst(wrapRef.current, containerRef.current, offsetTop);
    }
    updateSidebarHeight();
    
    window.addEventListener('scroll', updateSidebarHeight);
    window.addEventListener('resize', updateSidebarHeight)
    return () => {
      window.removeEventListener('scroll', updateSidebarHeight);
      window.removeEventListener('resize', updateSidebarHeight)
    }
  }, deps);

  return {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  }
}

export function BaseRender({ main, sidebarFirst }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);

  return (
    <div className='dz-TemplateBase' ref={containerRef}>
      <div className="dz-TemplateBase__sidebarFirst">
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div style={{ overflow: 'hidden' }} ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      </div>
      <div className="dz-TemplateBase__main">
        {main}
      </div>
      <div className="dz-TemplateBase__sidebarSecond" ref={sidebarSecondRef}></div>
      {/* <div className="dz-TemplateBase__sidebarThird"></div> */}
    </div>
  )
}

BaseRender.propTypes = {
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
}

export function BundleRender({ main, sidebarFirst, sidebarSecond}) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);

  return (
    <TemplateIV
      ref={containerRef}
      main={
        main
      }
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div style={{ overflow: 'hidden' }} ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
    />
  )
}

BundleRender.propTypes = {
  main: PropTypes.node,
  // extra: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
}


export function CoverRender({ title, summary, cover, copyright, extra, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);

  return (
    <TemplateIV
      id="dimzou-edit"
      ref={containerRef}
      main={
        <>
          <CoverTemplate
            title={title}
            summary={summary}
            cover={cover}
            copyright={copyright}
          />
          {extra}
        </>
      }
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div style={{ overflow: 'hidden' }} ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
    />
  )
}

CoverRender.propTypes = {
  title: PropTypes.node,
  summary: PropTypes.node,
  copyright: PropTypes.node,
  cover: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  extra: PropTypes.node,
}

export function ChapterNodeI({ id, title, summary, content, cover, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);

  return (
    <TemplateI 
      ref={containerRef}
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
      cover={cover}
      main={
        <div id={id} className='dz-Edit__main'>
          {title}
          {summary}
          {content}
        </div>
      }
    />
  )
}
ChapterNodeI.propTypes = renderProps;

export function ChapterNodeII({ id, title, summary, content, cover, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);

  return (
    <TemplateII
      ref={containerRef}
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
      cover={cover}
      main={
        <div id={id} className="dz-Edit__main">
          {title}
          {summary}
          {content}
        </div>
      }
    />
  )
}
ChapterNodeII.propTypes = renderProps;

export function ChapterNodeIII({ id, title, summary, content, cover, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);
      
  return (
    <TemplateIII
      ref={containerRef}
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
      cover={cover}
      content={
        <div id={id} className="dz-Edit__main">
          {content}
        </div>
      }
      titleSection={
        <div className="dz-Edit__titleSection">
          {title}
          {summary}
        </div>
      }
    />
  )
}
ChapterNodeIII.propTypes = renderProps;

export function ChapterNodeIV({ id, title, summary, content, cover, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);
  return (
    <TemplateIV 
      ref={containerRef}
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
      cover={cover}
      main={
        <div id={id} className="dz-Edit__main">
          {title}
          {summary}
          {content}
        </div>
      }
    />
  )
}
ChapterNodeIV.propTypes = renderProps;

export function ChapterNodeV({id, title, summary, content, cover, sidebarFirst, sidebarSecond }) {
  const {
    containerRef,
    wrapRef,
    labelRef,
    sidebarFirstRef,
    sidebarSecondRef,
  } = useDimzouLayout([]);
      
  return (
    <TemplateV 
      ref={containerRef}
      sidebarFirst={(
        <div ref={sidebarFirstRef} style={{ position: 'sticky' }}>
          <SidebarName ref={labelRef} />
          <div ref={wrapRef}>
            {sidebarFirst}
          </div>
        </div>
      )}
      sidebarSecond={(
        <div 
          ref={sidebarSecondRef}
          style={{ position: 'sticky' }}
        >
          {sidebarSecond}
        </div>
      )}
      cover={cover}
      main={
        <div id={id} className="dz-Edit__main">
          {title}
          {summary}
          {content}
        </div>
      }
    />
  )
}
ChapterNodeV.propTypes = renderProps;

export const getChapterRender = (template) => {
  switch (template) {
    case 'I':
      return ChapterNodeI;
    case 'II':
      return ChapterNodeII;
    case 'III':
      return ChapterNodeIII;
    case 'IV':
      return ChapterNodeIV;
    case 'V':
      return ChapterNodeV;
    default: 
      return ChapterNodeI;
  }
}