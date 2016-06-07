import React from 'react';
import OurTeamMember from './OurTeamMember'
const data = [
{id:1, name:"Wei Huang",location:'New York, NY', title:'Founder | CEO', experiences:"@Arringement @Quintessence", image:"https://s3.amazonaws.com/mbp-temp/community/wei_b.png"},
{id:2, name:"Divakar Rayapaty",location:'New Haven, CT', title:'CTO | Co-Founder', experiences:"@Priceline", image:"https://s3.amazonaws.com/mbp-temp/home/divakar.jpg"},
{id:3, name:"Sue Zhang",location:'New York, NY', title:'COO | Founder', experiences:"@Arringement", image:"../../assets/no-avatar.png"},
{id:4, name:"Naofumi Ezaki",location:'New York, NY',title:'Senior Full Stack Developer', experiences:"@Ernst & Young @NorthPoint", image:"../../assets/nao1.jpg"},
{id:5, name:"Jiang Chun Rong",location:'New York, NY', title:'Director of Project Management | Co-Founder', experiences:"@Wework @Marine Corp @Fedcap", image:"https://s3.amazonaws.com/mbp-temp/home/chun1.jpg"},
{id:6, name:"Ashley Chang",location:'New York, NY', title:'Director of Marketing | Co-Founder', experiences:"@HSBC @Dreamworks", image:"https://s3.amazonaws.com/mbp-temp/home/ashley.jpg"},
{id:8, name:"Gajendra Gupta",location:'New York, NY',title:'Director of Business Development | Co-Founder', experiences:"@Johareez Online Retailer", image:"https://s3.amazonaws.com/mbp-temp/home/team3.jpg"},
{id:9, name:"Jack Duong", title:'Software Engineer', location:'New York, NY',experiences:"@Tealeaf Academy", image:"../../assets/jack.jpg"},
{id:10, name:"Zhonghui Hao",location:'Beijing, China', title:'Director of Business Development for China | Co-Founder', experiences:"@Bank of China @Zhongyuan Trust @Sinosafe Insurance", image:"https://s3.amazonaws.com/mbp-temp/home/hao1.png"},
// {id:11, name:"Ivan Ramirez", title:'Advisor', experiences:"@Groupon @Overstock @Zerimar Ventures", image:"https://s3.amazonaws.com/mbp-temp/home/ramirez1.png"},
{id:13, name:'Dmitry Shingarev', location:'Tomsk, Russia', title:'VP of Technology - Russia',experiences:'@Makersbrand', image:"../../assets/dmitry.jpg"},
{id:14, name:'Alex Kosyakin', location:'Tomsk, Russia',title:'Team Lead Front-end Developer',experiences:'@Makersbrand', image:"../../assets/alexk.png"},
{id:15, name:'Vladimir Ustinov',location:'Tomsk, Russia', title:'Network Engineer, System Operator',experiences:'@Makersbrand', image:"../../assets/ustinov.png"},
{id:16, name:'Alexey Kulyukin',location:'Tomsk, Russia', title:'Front-end Developer',experiences:'@Makersbrand', image:"../../assets/alexey2.png"},
{id:17, name:'Denis Ryabokon', location:'Tomsk, Russia',title:'Back-end Developer',experiences:'@Makersbrand', image:"../../assets/Denis.jpg"},
{id:18, name:'Alex Demidov', location:'Tomsk, Russia',title:'Team Lead Back-end Developer',experiences:'@Makersbrand', image:"../../assets/Demidov.jpg"},
{id:19, name:'Rodion Stolyarov',location:'Tomsk, Russia', title:'Back-end Developer',experiences:'@Makersbrand', image:"../../assets/rodion.jpg"},
{id:20, name:'Bryan Gomula',location:'Melbourne, Australia', title:'Director of UX & UI',experiences:'@Makersbrand', image:"../../assets/bryan.jpg"},
];


const OurTeam = React.createClass({
  getInitialState(){
    return{
      tabClicked:0,
      tabChanged:false
    }
  },

  handleTabClicked(num){
      this.setState({tabClicked:num,tabChanged:true})
  },
  render() {
    let teamData;
      if(this.state.tabClicked >-1){
        switch(this.state.tabClicked){
          case 0:
            teamData=data;
            break;
          case 1:
          teamData=[];
            for(var i in data){
              if(data[i].type && data[i].type.indexOf('advisor') != -1){
                teamData.push(data[i]);
              }
            }
            break;
          case 2:
          teamData=[];
            for(var i in data){
              if(data[i].type && data[i].type.indexOf('investor')!= -1){
                teamData.push(data[i]);
              }
            }
            break;
          case 3:
            for(var i in data){
              if(data[i].type && data[i].type.indexOf('partner')!= -1){
                teamData.push(data[i]);
              }
            }
            break;
          case 4:
            for(var i in data){
              if(data[i].type && data[i].type.indexOf('volunteer')!= -1){
                teamData.push(data[i]);
              }
            }
            break;
        }
      }
    return <div id="our-team">
  <div id="our-team-banner">
      <div>
        <p>Meet the people behind Maker's Brand</p>
      </div>
  </div>
  <nav className="navbar navbar-default navbar-profile nav-padding" role="navigation">
      <div>
        <ul className="nav navbar-nav">
          <a className={this.state.tabClicked ===0 ? 'active' : null} onClick={()=>this.handleTabClicked(0)}><li>
            Team
          </li></a>
          <a className={this.state.tabClicked ===1 ? 'active' : null} onClick={()=>this.handleTabClicked(1)}><li>
            Advisors
          </li></a>
          <a className={this.state.tabClicked ===2 ? 'active' : null} onClick={()=>this.handleTabClicked(2)}><li>
            Investors
          </li></a>
          <a className={this.state.tabClicked ===3 ? 'active' : null} onClick={()=>this.handleTabClicked(3)}><li>
            Partner
          </li></a>
          <a className={this.state.tabClicked ===4 ? 'active' : null} onClick={()=>this.handleTabClicked(4)}><li >
            Volunteer
          </li></a>
        </ul>
      </div>
    </nav>
      <section className="section"  style={{background:'#E8E8E8'}}>
        <div className="container">
          <div className="row">
            <TeamMemberBox items={teamData}/>
          </div>
        </div>
      </section>
    </div>;
  }
});
class TeamMemberBox extends React.Component{
  render(){
    let test =this.props.items
    if(!this.props.items){
      return null
    }else{
    var teamMemberNodes = test.map(function(team,index){
      return(
        <div key={team.id} className="col-md-4">
          <div className="profile-box">
              <OurTeamMember
                image={team.image && team.image}
                title={team.title && team.title}
                name={team.name && team.name}
                location= {team.location && team.location}
                state= {team.addresses && team.addresses[0].state}
                id={team.id && team.id}
               />
           </div>
        </div>
        )
    });
    return (
      <div>
        {teamMemberNodes}
      </div>
      );
    }
  }
}

export default OurTeam
