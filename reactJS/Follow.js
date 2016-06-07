import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions';

const FollowButton = React.createClass ({

	getInitialState(){
		return {checked:null, following:null}
	},
	componentWillMount(){
		if(this.props.user){
			this.props.followCheck(this.props.user.id);
		}
	},

	componentWillReceiveProps(nextProp){
		if (nextProp.user && nextProp.user.object_type == 'designer_role'){
			this.props.followCheck(nextProp.user.user);
		}
		if(nextProp.user_is_followed == true){
			this.setState({following : true, checked:true});
		}else if (nextProp.user_is_followed == false){
			this.setState({following : false, checked:true});
		}
	},
 
	handleClick(){
		if(this.state.following == false || this.state.following == null || this.state.following == undefined){
			this.setState({following: true});		
			this.props.followUser(this.props.user.id)
		}else{
			this.setState({following: false});	
			this.props.unFollowUser(this.props.user.id);
		}
	},

	render(){
		const {user_is_followed, dataUser}=this.props;
		let followBtnClass;
		let arr=[]
		let load=null

		if(this.state.following == true){
			followBtnClass = 'following-btn';
		}else{
			followBtnClass = 'not-followed-btn';
		}

		return(
			<div>
			  {this.state.checked && <div data={this.props.dataUser} className= {followBtnClass + ' user-followers'} onClick = {this.handleClick}>
					<span>
						<button className='btn btn-md'>
							<span className={this.state.following ? 'glyphicon glyphicon-check': 'glyphicon glyphicon-plus'}>
							</span> {this.state.following ? 'Following' : 'Follow'} 
						</button>
					</span>
				</div> }
			</div>
		)
	}

});

const mapStateToProps = (state) => ({
	user : state.user.data,
	auth : state.auth.user,
	user_is_followed : state.user.follow_check_user,
});

const mapDispatchToProps = (dispatch) => ({
	followUser: function(userId){
		dispatch(Actions.followUser(userId));
	},
	unFollowUser: function(userId){
		dispatch(Actions.unFollowUser(userId));
	},
	followCheck:function(userId){
  	dispatch(Actions.followCheck(userId));
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);